from geopy.geocoders import Nominatim
import ssl

class LocationService(object):

    def __init__(self):
        self._locator = Nominatim(user_agent="myGeocoder")

    def get_coords(self, address, city, state_code, zip, country):
        """
        Returns an array ([lat, lon]) of coordinates or None if no coords
        are generated.
        """
        address_str = "%s, %s, %s %s %s" % (address, city, state_code, zip, country)
        location = self._locator.geocode(address_str)
        return [location.latitude, location.longitude] if location else None            

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