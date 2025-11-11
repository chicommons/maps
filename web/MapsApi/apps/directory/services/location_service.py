from apps.directory.models import Address, AddressCache
from django.core.exceptions import ObjectDoesNotExist
from geopy.exc import GeocoderQuotaExceeded, GeocoderQueryError
from geopy.geocoders import Nominatim
from ratelimit import limits, RateLimitException
from backoff import on_exception, expo
import re
import json

def preprocess_street_address(address:Address):
    unit_number_pattern = re.compile(r'\b(?:apt|unit|suite|office|room)\b\s*[#\d-]*', re.IGNORECASE)
    cleaned_address = re.sub(unit_number_pattern, '', address)
    cleaned_address = ' '.join(cleaned_address.split())
    return cleaned_address

class LocationService(object):
    def __init__(self, address:Address):
        self.address = address
        self.geo_response = None
        self._fetch_geo_response()

    @on_exception(expo, RateLimitException, max_tries=8, jitter=None) # If RateLimitException is thrown, wait with exponential backoff(expo) and retry. Maximum of 8 times.
    @limits(calls=1, period=1) # 1 Call per 1 second. Throws RateLimitException if exceeded.
    def _call_geocoder_api(self):
        street_address_cleaned = preprocess_street_address(self.address.street_address)
        self.query = "%s, %s %s %s" % (street_address_cleaned, self.address.city, self.address.state, self.address.postal_code)
    
        service = Nominatim(user_agent="chicommons")
        try:
            geocode = service.geocode(query=self.query, exactly_one=True, addressdetails=True, language='en', country_codes='US', timeout=30)
            return geocode.raw
        except GeocoderQuotaExceeded:
            raise RateLimitException("Rate limit exceeded", period_remaining=60)
        except RateLimitException:
            raise RateLimitException("Rate limit exceeded", period_remaining=60)
        except GeocoderQueryError:
            raise Exception("Invalid LocationService query: '%s' %s" %(self.address))
        except Exception:
            raise Exception("Address could not be geocoded: %s" %(self.address))

    def _fetch_geo_response(self):
        street_address_cleaned = preprocess_street_address(self.address.street_address)
        self.query = "%s, %s %s %s" % (street_address_cleaned, self.address.city, self.address.state, self.address.postal_code)

        try:
            cached_address = AddressCache.objects.get(query=self.query)
            self.geo_response = json.loads(cached_address.response)
        except ObjectDoesNotExist:
            cached_address = None
            geocode = self._call_geocoder_api()
            self.geo_response = geocode
            response_json = json.dumps(self.geo_response, indent=4, sort_keys=True)
            AddressCache.objects.create( query=self.query, response=response_json, place_id=self.geo_response["place_id"])

    def get_coords(self) -> tuple[float, float]:
        if self.geo_response is None:
            self._fetch_geo_response()
        
        if self.geo_response["lat"] and self.geo_response["lon"]:
            return (self.geo_response['lat'], self.geo_response['lon'])
        else:
            raise Exception("Unexpected response format for geocode_task: %s" %(self.geo_response))
    
    def save_coords(self): 
        if self.geo_response is None:
            self._fetch_geo_response()
        
        latitude, longitude = self.get_coords()

        if latitude and longitude:
            self.address.latitude=latitude
            self.address.longitude=longitude
            self.address.save()
        else:
            raise Exception("save_coords failed")
    
    def get_county(self) -> str:
        if self.geo_response is None:
            self._fetch_geo_response()
        
        if self.geo_response["address"]["county"]:
            return self.geo_response["address"]["county"]
        else:
            raise Exception("Unexpected response format for geocode_task: %s" %(self.geo_response))
    
    def save_county(self):
        if self.geo_response is None:
            self._fetch_geo_response()
        
        county = self.get_county()

        if county:
            self.address.county = county
            self.address.save()
        else:
            raise Exception("save_county failed")
