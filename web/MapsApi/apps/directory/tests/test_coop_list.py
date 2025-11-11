from apps.directory.models import Coop
from apps.users.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from . import helpers
import pathlib
from unittest.mock import patch

class TestCoopList(APITestCase):
    fixtures = ["testcooplist.json"]

    @classmethod
    def setUpTestData(cls):
        pass

    @patch('apps.directory.services.location_service.Nominatim')    
    def setUp(self, mock_nominatim):
        self.mock_raw_dict = {'lat': 37.4221, 'lon': -122.0841, 'place_id': 'XXXYYYYZZZ', 'address': {'county': 'Testing County'}}

        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        # Creating Coops as Superuser
        self.user = User.objects.create_superuser(email='test@example.com', password='admin', first_name="Super", last_name="User")
        client = APIClient()
        token = helpers.obtain_jwt_token("admin", "admin")
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        self.staging_dir_path = (pathlib.Path(__file__).parent / 'files' / 'staging').resolve()
        self.testcases_dir_path = (pathlib.Path(__file__).parent / 'files' / 'testcases').resolve()

        # coop_list_filename = "coop_list.json"
        # coop_list_filepath = (self.staging_dir_path / coop_list_filename).resolve()

        # url = reverse('coop-list')
        # with open(coop_list_filepath, 'r') as file:
        #     coops = json.load(file)

        # for request in coops:
        #     response = client.post(url, request, format='json')
        #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_list_all(self):
        # Acting as unauthorized user
        results_filename = "TestCoopList_test_list_all.json"
        results_filepath = (self.testcases_dir_path / results_filename).resolve()

        url = reverse('coop-list')
        request = {}
        response = self.client.get(url, data=request, format='json')
        response_data = helpers.sanitize_response(response)

        # # When the structure of the result or test dataset changes, uncomment this
        # #    section and run to update results files. Recomment when running test cases. 
        # with open(results_filepath, 'w') as file:
        #     file.write(response_data)

        with open(results_filepath, "r") as file:
            expected_data = file.read()

        self.maxDiff = None
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.client._credentials, {}) # Assert acting as unauthorized user
        self.assertEqual(Coop.objects.count(), 10)
        self.assertEqual(len(response.data), 8)
        self.assertEqual(response_data, expected_data)  
    
    def test_filter_name(self):
        # Acting as unauthorized user
        results_filename = "TestCoopList_test_filter_name.json"
        results_filepath = (self.testcases_dir_path / results_filename).resolve()
        
        url = reverse('coop-list')
        request = {
            'name': 'banana'
        }
        response = self.client.get(url, data=request, format='json')
        response_data = helpers.sanitize_response(response)

        # # When the structure of the result or test dataset changes, uncomment this
        # #    section and run to update results files. Recomment when running test cases. 
        # with open(results_filepath, 'w') as file:
        #     file.write(response_data)

        with open(results_filepath, "r") as file:
            expected_data = file.read()

        self.maxDiff = None
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.client._credentials, {}) # Assert acting as unauthorized user
        self.assertEqual(Coop.objects.count(), 10)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response_data, expected_data)        
    
    def test_filter_street(self):
        # Acting as unauthorized user
        results_filename = "TestCoopList_test_filter_street.json"
        results_filepath = (self.testcases_dir_path / results_filename).resolve()

        url = reverse('coop-list')
        request = {
            'street': 'michigan'
        }
        response = self.client.get(url, data=request, format='json')
        response_data = helpers.sanitize_response(response)

        # # When the structure of the result or test dataset changes, uncomment this
        # #    section and run to update results files. Recomment when running test cases. 
        # with open(results_filepath, 'w') as file:
        #     file.write(response_data)

        with open(results_filepath, "r") as file:
            expected_data = file.read()

        self.maxDiff = None
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.client._credentials, {}) # Assert acting as unauthorized user
        self.assertEqual(Coop.objects.count(), 10)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response_data, expected_data)
    
    def test_filter_city(self):
        # Acting as unauthorized user
        results_filename = "TestCoopList_test_filter_city.json"
        results_filepath = (self.testcases_dir_path / results_filename).resolve()

        url = reverse('coop-list')
        request = {
            'city': 'Chicago'
        }
        response = self.client.get(url, data=request, format='json')
        response_data = helpers.sanitize_response(response)

        # # When the structure of the result or test dataset changes, uncomment this
        # #    section and run to update results files. Recomment when running test cases. 
        # with open(results_filepath, 'w') as file:
        #     file.write(response_data)

        with open(results_filepath, "r") as file:
            expected_data = file.read()

        self.maxDiff = None
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.client._credentials, {}) # Assert acting as unauthorized user
        self.assertEqual(Coop.objects.count(), 10)
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response_data, expected_data)  
    
    def test_filter_zip(self):
        # Acting as unauthorized user
        results_filename = "TestCoopList_test_filter_zip.json"
        results_filepath = (self.testcases_dir_path / results_filename).resolve()

        url = reverse('coop-list')
        request = {
            'zip': '60611'
        }
        response = self.client.get(url, data=request, format='json')
        response_data = helpers.sanitize_response(response)

        # # When the structure of the result or test dataset changes, uncomment this
        # #    section and run to update results files. Recomment when running test cases. 
        # with open(results_filepath, 'w') as file:
        #     file.write(response_data)

        with open(results_filepath, "r") as file:
            expected_data = file.read()

        self.maxDiff = None
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.client._credentials, {}) # Assert acting as unauthorized user
        self.assertEqual(Coop.objects.count(), 10)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response_data, expected_data) 

    def test_filter_types(self):
        # Acting as unauthorized user
        results_filename = "TestCoopList_test_filter_types.json"
        results_filepath = (self.testcases_dir_path / results_filename).resolve()

        url = reverse('coop-list')
        request = {
            'types': 'Library,Laboratory,Arboretum'
        }
        response = self.client.get(url, data=request, format='json')
        response_data = helpers.sanitize_response(response)

        # # When the structure of the result or test dataset changes, uncomment this
        # #    section and run to update results files. Recomment when running test cases. 
        # with open(results_filepath, 'w') as file:
        #     file.write(response_data)

        with open(results_filepath, "r") as file:
            expected_data = file.read()

        self.maxDiff = None
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.client._credentials, {}) # Assert acting as unauthorized user
        self.assertEqual(Coop.objects.count(), 10)
        self.assertEqual(len(response.data), 5)
        self.assertEqual(response_data, expected_data) 
    
    def test_filter_stacked(self):
        # Acting as unauthorized user
        results_filename = "TestCoopList_test_filter_stacked.json"
        results_filepath = (self.testcases_dir_path / results_filename).resolve()

        url = reverse('coop-list')
        request = {
            # find Coop #2
            'enabled': 'true', #returns 1,2,3,4,5,6
            'types': 'Library,Laboratory,Arboretum', #returns 1,2,4,5,6
            'city': 'chicago', #returns 1,2,3,4
            'name': 'banana', #returns 2,4,6
            'street': 'michigan', #returns 2,6
            'zip': '60611', #returns 2,3

        }
        response = self.client.get(url, data=request, format='json')
        response_data = helpers.sanitize_response(response)

        # # When the structure of the result or test dataset changes, uncomment this
        # #    section and run to update results files. Recomment when running test cases. 
        # with open(results_filepath, 'w') as file:
        #     file.write(response_data)

        with open(results_filepath, "r") as file:
            expected_data = file.read()

        self.maxDiff = None
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.client._credentials, {}) # Assert acting as unauthorized user
        self.assertEqual(Coop.objects.count(), 10)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response_data, expected_data) 