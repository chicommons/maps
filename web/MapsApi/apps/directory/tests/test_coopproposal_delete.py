from apps.directory.models import CoopProposal, CoopPublic, Coop, CoopType, ContactMethod, Address, CoopAddressTags, Person, User
from rest_framework.test import APITestCase
from unittest.mock import patch
import pathlib
from . import helpers
from django.urls import reverse
from rest_framework import status

class TestCoopProposalDelete(APITestCase):
    @classmethod
    def setUpTestData(cls):
        pass

    def setUp(self):
        self.staging_dir_path = (pathlib.Path(__file__).parent / 'files' / 'staging').resolve()
        self.testcases_dir_path = (pathlib.Path(__file__).parent / 'files' / 'testcases').resolve()
        self.mock_raw_dict = {'lat': 37.4221, 'lon': -122.0841, 'place_id': 'XXXYYYYZZZ', 'address': {'county': 'Testing County'}}
        self.user = User.objects.create_superuser(email='testuser@example.com', password='password')
        self.token = helpers.obtain_jwt_token("testuser@example.com", "password")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.create_data = {
            "operation": "CREATE",
            "coop": {
                "name": "Test Max 9999",
                "web_site": "http://www.1871.com/",
                "description": "My Coop Description",
                "is_public": True,
                "scope": "Testing", #TODO - What are acceptable values?
                "tags": "tag1, tag2, tag3", #TODO - What are acceptable values?
                "types": [ {"name": "Library"}, {"name": "Museum"} ],
                "contact_methods": [
                    { "type": "EMAIL", "is_public": True, "email": "myemail@example.com" },
                    { "type": "PHONE", "is_public": True, "phone": "+17739441426" }          
                ],
                "people": [
                    {"first_name": "John", "last_name": "Doe", "is_public": False, "contact_methods": []}, 
                    {"first_name": "Steve", "last_name": "Smith", "is_public": False, "contact_methods": [
                        { "type": "EMAIL", "is_public": True, "email": "stevesmith@example.com" },
                        { "type": "PHONE", "is_public": True, "phone": "+13125555555" }
                    ]}
                ],
                "addresses": [
                    {
                        "is_public": True,
                        "address": { "street_address": "222 W. Merchandise Mart Plaza, Suite 1212", "city": "Chicago", "state": "IL", "postal_code": "60654", "country": "US" }
                    },
                    {
                        "is_public": True,
                        "address": {  "street_address": "400 W 76th Street", "city": "Chicago", "state": "IL", "postal_code": "60620", "country": "US" }
                    }
                ]
            }
        }
        response = self.client.post(reverse('coop-proposal'), self.create_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.proposal_id = response.data["id"]
        
        approval_data = {
            "proposal_status": "APPROVED",
            "review_notes": "lgtm"
        }
        response = self.client.patch(reverse('coop-review', args=[self.proposal_id]), approval_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.coop_public_id = response.data["coop_public_id"]

    @patch('apps.directory.services.location_service.Nominatim')
    def test_delete(self, mock_nominatim):
         # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        request = {
            "operation": "DELETE",
            "coop_public_id": self.coop_public_id
        }

        response = self.client.post(reverse('coop-proposal'), request, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(self.client._credentials['HTTP_AUTHORIZATION'], f'Bearer {self.token}')

        self.assertEqual(CoopProposal.objects.count(), 2)
        self.assertEqual(CoopPublic.objects.count(), 1)
        self.assertEqual(Coop.objects.count(), 1)
        self.assertEqual(CoopType.objects.count(), 2)
        self.assertEqual(ContactMethod.objects.count(), 4)
        self.assertEqual(Person.objects.count(), 2)
        self.assertEqual(CoopAddressTags.objects.count(), 2)
        self.assertEqual(Address.objects.count(), 2)

        coop_proposal = CoopProposal.objects.get(pk=response.data['id'])
        self.assertEqual(coop_proposal.proposal_status, "PENDING")
        self.assertEqual(coop_proposal.operation, "DELETE")