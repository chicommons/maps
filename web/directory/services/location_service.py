# removed 7/21/222 
from geopy.geocoders import Nominatim
import ssl
import sys
import requests


from address.models import State, Country, Locality, Address

class LocationService(object):

    def __init__(self):
        self._locator = Nominatim(user_agent="myGeocoder")

    def get_coords(self, address, city, state_code, zip, country_code):
        """
        Returns an array ([lat, lon]) of coordinates or None if no coords
        are generated.  "country_code" is a 2-letter abbreviation referencing the
        address_country.code column.
        """
        latitude = None
        longitude = None
        country = Country.objects.filter(code=country_code).first() 
        state = State.objects.filter(
            code=state_code,
            country=country
        ).first()
        if state:
            locality = Locality.objects.filter(
                name=city,
                postal_code=zip,
                state=state
            ).first()
            if locality:
                address = Address.objects.filter(
                    raw=address,
                    locality=locality
                ).first()
                if address and address.latitude and address.longitude:
                    latitude = address.latitude
                    longitude = address.longitude
        if not latitude and not longitude:
            address_str = "%s, %s, %s %s %s" % (address, city, state_code, zip, country.name if country else "")
            if not address:
                address_str = "%s, %s %s %s" % (city, state_code, zip, country.name if country else "")
            try:
                # get geo loc from Open Street Maps 7/11/22
                # fmi see https://www.natasshaselvaraj.com/a-step-by-step-guide-on-geocoding-in-python/
                #         https://nominatim.org/release-docs/latest/api/Overview/
                url = 'https://nominatim.openstreetmap.org/search/' + address_str +'?format=json'
                location = requests.get(url).json()
                if location:
                    latitude = float(location[0]['lat'])
                    longitude = float(location[0]['lon'])
                else:
                    print("Failed to find coordinates for %s " % address_str, file=sys.stderr) 
            except Exception as err:
                 print("%s: Failed to find coordinates for %s " % (str(err), address_str), file=sys.stderr) 
           
        return [latitude, longitude] if latitude and longitude else None            

    def save_coords(self, address):
        """
        Takes a model object of type address.address and sets
        the latitude and lonitude (if possible) of the object and saves
        this object.
        """
        ssl._create_default_https_context = ssl._create_unverified_context
        
        if self._locator:
            state = address.locality.state
            country = state.country
            # This is an example of a formatted address string that will return lat and lon:
            #     "1600 Pennsylvania Avenue NW, Washington, DC 20500 United States"
            coords = self.get_coords(
                address.formatted, 
                address.locality.name, 
                state.code, 
                address.locality.postal_code, 
                country.name
            )
            if coords:
                address.latitude = coords[0]
                address.longitude = coords[1]
                address.save(update_fields=["latitude", "longitude"])      
