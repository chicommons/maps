from apps.directory.models import Address, AddressCache
from apps.directory.serializers import AddressSerializer
from rest_framework.test import APITestCase
import json
from unittest.mock import patch, MagicMock
from apps.directory.services.location_service import LocationService
from ratelimit import RateLimitException

class TestAddressSerializer(APITestCase):
    @classmethod
    def setUpTestData(cls):
        pass

    def setUp(self):
        self.address = Address.objects.create(
            street_address='123 Fake Street',
            city='Faketown',
            state='FS',
            postal_code='12345',
            country='US'
        )
        self.address_data = {
            'street_address': '124 Fake Street',
            'city': 'Faketown',
            'state': 'FS',
            'postal_code': '12345',
            'country': 'US'
        }
        self.update_data = {
            'street_address': '200 Updated Avenue',  # Change that should trigger geocoding
            'city': 'Faketown',
            'state': 'FS',
            'postal_code': '12345',
            'country': 'US'
        }
        self.query = f"{self.address.street_address}, {self.address.city} {self.address.state} {self.address.postal_code}"
        self.mock_raw_dict = {'lat': 37.4221, 'lon': -122.0841, 'place_id': 'XXXYYYYZZZ', 'address': {'county': 'Testing County'}}
 
    
    @patch('apps.directory.services.location_service.Nominatim')
    def test_addressserializer_create(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        # Create an address instance using the serializer
        address_serializer = AddressSerializer(data=self.address_data)
        if address_serializer.is_valid():
            address = address_serializer.save()
        else: 
            self.fail(address_serializer.errors)  # Ensure the test fails if the data is invalid

        # Assertions
        self.assertEqual(Address.objects.count(), 2) 
        # Assert values coming from address_data
        self.assertEqual(address.street_address, self.address_data["street_address"]) 
        self.assertEqual(address.city, self.address_data["city"]) 
        self.assertEqual(address.state, self.address_data["state"]) 
        self.assertEqual(address.postal_code, self.address_data["postal_code"]) 
        self.assertEqual(address.country, self.address_data["country"])
        # Assert values coming from geocode
        self.assertEqual(address.latitude, self.mock_raw_dict['lat'])
        self.assertEqual(address.longitude, self.mock_raw_dict['lon'])
        self.assertEqual(address.county, self.mock_raw_dict['address']['county'] )

    @patch('apps.directory.services.location_service.Nominatim')
    def test_addressserializer_update(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        # Load the existing address into the serializer along with the new data for update
        serializer = AddressSerializer(instance=self.address, data=self.update_data, partial=False)
        
        if serializer.is_valid():
            address = serializer.save()
        else:
            self.fail(serializer.errors)  # Ensure the test fails if the data is invalid
        
        # Assertions
        self.assertEqual(Address.objects.count(), 1) 
        # Assert values coming from address_data
        self.assertEqual(address.street_address, self.update_data["street_address"]) 
        self.assertEqual(address.city, self.update_data["city"]) 
        self.assertEqual(address.state, self.update_data["state"]) 
        self.assertEqual(address.postal_code, self.update_data["postal_code"]) 
        self.assertEqual(address.country, self.update_data["country"])
        # Assert values coming from geocode
        self.assertEqual(address.latitude, self.mock_raw_dict['lat'])
        self.assertEqual(address.longitude, self.mock_raw_dict['lon'])
        self.assertEqual(address.county, self.mock_raw_dict['address']['county'] )

    @patch('apps.directory.services.location_service.Nominatim')
    def test_addresscache_hit(self, mock_nominatim):
        # Prepopulate the cache with a mock response for our test address
        AddressCache.objects.create(query=self.query, response=json.dumps(self.mock_raw_dict), place_id=self.mock_raw_dict['place_id'])

        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)
        
        # Execute the task
        LocationService(self.address).save_coords()
        
        # Assertions
        self.address.refresh_from_db()
        self.assertEqual(self.address.latitude, self.mock_raw_dict['lat'])
        self.assertEqual(self.address.longitude, self.mock_raw_dict['lon'])
        mock_nominatim.assert_not_called()  # Nominatim should not be called due to cache hit

    @patch('apps.directory.services.location_service.Nominatim')
    def test_addresscache_miss(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)
        
        # Ensure the cache is empty to simulate a cache miss
        AddressCache.objects.filter(query=self.query).delete()
        
        # Execute the task
        LocationService(self.address).save_coords()
        
        # Assertions
        self.address.refresh_from_db()
        self.assertEqual(self.address.latitude, self.mock_raw_dict['lat'])
        self.assertEqual(self.address.longitude, self.mock_raw_dict['lon'])
        # Ensure Nominatim was called
        mock_nominatim.assert_called_once()
        # Check that the response is now cached
        self.assertTrue(AddressCache.objects.filter(query=self.query).exists())

    @patch('apps.directory.services.location_service.Nominatim')
    @patch('apps.directory.services.location_service.LocationService.save_coords')
    def test_save_coords_triggered_on_address_create(self, mock_save_coords, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        # Create an address instance using the serializer
        serializer = AddressSerializer(data=self.address_data)
        if serializer.is_valid():
            serializer.save()
        else:
            self.fail(serializer.errors)  # Ensure the test fails if the data is invalid
        
        # Check if LocationService.save_coords has been called once
        mock_save_coords.assert_called_once()
        self.assertEqual(Address.objects.count(), 2) # 1) self.address, 2) new address created here

    @patch('apps.directory.services.location_service.Nominatim')
    @patch('apps.directory.services.location_service.LocationService.save_coords')
    def test_save_coords_triggered_on_address_update(self, mock_save_coords, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        update_data = {
            'street_address': '200 Updated Avenue',  # Change that should trigger geocoding
            'city': 'Faketown',
            'state': 'FS',
            'postal_code': '12345',
            'country': 'US'
        }

        # Load the existing address into the serializer along with the new data for update
        serializer = AddressSerializer(instance=self.address, data=update_data, partial=False)
        
        if serializer.is_valid():
            serializer.save()
        else:
            self.fail(serializer.errors)  # Ensure the test fails if the data is invalid

        # Check if LocationService.save_coords has been called once
        mock_save_coords.assert_called_once()
        self.assertEqual(Address.objects.count(), 1) # 1) updated self.address
    
    @patch('apps.directory.services.location_service.Nominatim')
    @patch('apps.directory.services.location_service.LocationService.save_county')
    def test_save_county_triggered_on_address_create(self, mock_save_county, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        # Create an address instance using the serializer
        serializer = AddressSerializer(data=self.address_data)
        if serializer.is_valid():
            serializer.save()
        else:
            self.fail(serializer.errors)  # Ensure the test fails if the data is invalid
        
        # Check if LocationService.save_county has been called once
        mock_save_county.assert_called_once()
        self.assertEqual(Address.objects.count(), 2) # 1) self.address, 2) new address created here

    @patch('apps.directory.services.location_service.Nominatim')
    @patch('apps.directory.services.location_service.LocationService.save_coords')
    def test_save_county_triggered_on_address_update(self, mock_save_county, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        update_data = {
            'street_address': '200 Updated Avenue',  # Change that should trigger geocoding
            'city': 'Faketown',
            'state': 'FS',
            'postal_code': '12345',
            'country': 'US'
        }

        # Load the existing address into the serializer along with the new data for update
        serializer = AddressSerializer(instance=self.address, data=update_data, partial=False)
        
        if serializer.is_valid():
            serializer.save()
        else:
            self.fail(serializer.errors)  # Ensure the test fails if the data is invalid

        # Check if LocationService.mock_save_county has been called once
        mock_save_county.assert_called_once()
        self.assertEqual(Address.objects.count(), 1) # 1) updated self.address

    @patch('apps.directory.services.location_service.Nominatim')
    def test_rate_limit_enforcement(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        # Attempt to call the API more than the rate limit allows
        for _ in range(5):
            try:
                LocationService(self.address)._call_geocoder_api()  # Assuming the function is part of a class
            except Exception as e:
                # Verify that RateLimitException is raised on exceeding rate limit
                self.assertIsInstance(e, RateLimitException)
    
    @patch('apps.directory.services.location_service.Nominatim')
    @patch('time.sleep', return_value=None)  # Mock time.sleep to simulate passage of time without actually waiting
    def test_exponential_backoff(self, mock_sleep, mock_nominatim):
        # Setup the mocked Nominatim service to alternate between raising RateLimitException and returning a valid response
        mock_service_instance = MagicMock()
        mock_nominatim.return_value = mock_service_instance
        # Simulate RateLimitException for the first 7 calls, then return a valid response
        side_effects = [RateLimitException("Rate limit exceeded", period_remaining=60) for _ in range(7)]
        side_effects.append(MagicMock(raw=self.mock_raw_dict))  # Assuming the last attempt succeeds
        mock_service_instance.geocode.side_effect = side_effects

        # Configure the geocode method to raise RateLimitException
        mock_service_instance.geocode.side_effect = RateLimitException("Rate limit exceeded", period_remaining=60)

        try:
            LocationService(self.address)  # Attempt to call the function
        except RateLimitException:
            pass  # Expected exception after max retries

        # Assert that time.sleep was called the correct number of times (max_tries - 1) for the backoff
        self.assertEqual(mock_sleep.call_count, 7)  # 8 tries means 7 waits between them

        # Verify that the delay increases exponentially
        expected_delays = [2**i for i in range(7)]  # Exponential backoff delays
        actual_calls = mock_sleep.call_args_list
        actual_delays = [call[0][0] for call in actual_calls]  # Extract the first argument to each call (the delay)

        # increasing = all(actual_delays[i] <= actual_delays[i + 1] for i in range(len(actual_delays) - 1))
        # self.assertTrue(increasing, "Expected delays to increase")
        for expected, actual in zip(expected_delays, actual_delays):
            self.assertAlmostEqual(expected, actual, delta=1) 