import pytest
from django.test import TestCase
from .factories import CoopTypeFactory, CoopFactory, AddressFactory, PhoneContactMethodFactory
from directory.services.location_service import LocationService 


class ServiceTests(TestCase):

    def test_reuse_lat_lon(self):
        """
        If we already have lat/lon defined in an address, verify location service uses those 
        """
        test_lat = 100
        test_lon = 100
        address = AddressFactory(latitude=test_lat, longitude=test_lon)
        svc = LocationService()
        coords = svc.get_coords(
            address=address.raw,
            city=address.locality.name,
            state_code=address.locality.state.code,
            zip=address.locality.postal_code,
            country_code=address.locality.state.country.code
        )
        assert coords[0] == test_lat, "Failed to return proper latitude."
        assert coords[1] == test_lon, "Failed to return proper longitude."



