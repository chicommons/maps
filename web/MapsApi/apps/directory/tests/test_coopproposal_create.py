from apps.directory.models import CoopProposal, CoopPublic, Coop, CoopType, ContactMethod, Address, CoopAddressTags, Person, User
from rest_framework.test import APITestCase
from unittest.mock import patch
import pathlib
from . import helpers
from django.urls import reverse
from rest_framework import status

class TestCoopProposalCreate(APITestCase):
    @classmethod
    def setUpTestData(cls):
        pass

    def setUp(self):
        self.staging_dir_path = (pathlib.Path(__file__).parent / 'files' / 'staging').resolve()
        self.testcases_dir_path = (pathlib.Path(__file__).parent / 'files' / 'testcases').resolve()
        self.mock_raw_dict = {'lat': 37.4221, 'lon': -122.0841, 'place_id': 'XXXYYYYZZZ', 'address': {'county': 'Testing County'}}
        self.user = User.objects.create_user(email='testuser@example.com', password='password')
        self.token = helpers.obtain_jwt_token("testuser@example.com", "password")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
  
    @patch('apps.directory.services.location_service.Nominatim')
    def test_create_empty(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        request = {
            "operation": "CREATE",
            "coop": {
            }
        }

        response = self.client.post(reverse('coop-proposal'), request, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(self.client._credentials['HTTP_AUTHORIZATION'], f'Bearer {self.token}')

        self.assertEqual(CoopProposal.objects.count(), 1)
        self.assertEqual(CoopPublic.objects.count(), 0)
        self.assertEqual(Coop.objects.count(), 1)
        self.assertEqual(CoopType.objects.count(), 0)
        self.assertEqual(ContactMethod.objects.count(), 0)
        self.assertEqual(Person.objects.count(), 0)
        self.assertEqual(CoopAddressTags.objects.count(), 0)
        self.assertEqual(Address.objects.count(), 0)

        coop_proposal = CoopProposal.objects.get(pk=response.data['id'])
        self.assertEqual(coop_proposal.proposal_status, "PENDING")
        self.assertEqual(coop_proposal.operation, "CREATE")
        self.assertIsNotNone(coop_proposal.requested_datetime)
        self.assertEqual(coop_proposal.requested_by.username, self.user.username)
        self.assertIsNone(coop_proposal.reviewed_datetime)
        self.assertIsNone(coop_proposal.reviewed_by)
        self.assertIsNone(coop_proposal.review_notes)
        self.assertIsNone(coop_proposal.coop_public)

        coop = Coop.objects.get(pk=response.data['coop']['id'])
        self.assertEqual(coop.status, "PROPOSAL")
        self.assertIsNone(coop.coop_public)
        self.assertEqual(coop.name, None)
        self.assertEqual(coop.types.count(), 0)
        self.assertEqual(coop.addresses.count(), 0)
        self.assertEqual(coop.people.count(), 0)
        self.assertEqual(coop.contact_methods.count(), 0)

    @patch('apps.directory.services.location_service.Nominatim')
    def test_create_basic(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        request = {
            "operation": "CREATE",
            "coop": {
                "name": "Test Max 9999",
                "web_site": "http://www.1871.com/",
                "description": "My Coop Description",
                "is_public": True,
                "scope": "Testing",
                "tags": "tag1, tag2, tag3"
            }
        }

        response = self.client.post(reverse('coop-proposal'), request, format='json')

        self.assertEqual(CoopProposal.objects.count(), 1)
        self.assertEqual(CoopPublic.objects.count(), 0)
        self.assertEqual(Coop.objects.count(), 1)
        self.assertEqual(CoopType.objects.count(), 0)
        self.assertEqual(ContactMethod.objects.count(), 0)
        self.assertEqual(Person.objects.count(), 0)
        self.assertEqual(CoopAddressTags.objects.count(), 0)
        self.assertEqual(Address.objects.count(), 0)

        coop_proposal = CoopProposal.objects.get(pk=response.data['id'])
        self.assertEqual(coop_proposal.proposal_status, "PENDING")
        self.assertEqual(coop_proposal.operation, "CREATE")
        self.assertIsNotNone(coop_proposal.requested_datetime)
        self.assertEqual(coop_proposal.requested_by.username, self.user.username)
        self.assertIsNone(coop_proposal.reviewed_datetime)
        self.assertIsNone(coop_proposal.reviewed_by)
        self.assertIsNone(coop_proposal.review_notes)
        self.assertIsNone(coop_proposal.coop_public)

        coop = Coop.objects.get(pk=response.data['coop']['id'])
        self.assertEqual(coop.status, "PROPOSAL")
        self.assertIsNone(coop.coop_public)
        self.assertEqual(coop.name, request["coop"]["name"])
        self.assertEqual(coop.web_site, request["coop"]["web_site"])
        self.assertEqual(coop.description, request["coop"]["description"])
        self.assertEqual(coop.is_public, request["coop"]["is_public"])
        self.assertEqual(coop.scope, request["coop"]["scope"])
        self.assertEqual(coop.tags, request["coop"]["tags"])
        self.assertEqual(coop.types.count(), 0)
        self.assertEqual(coop.addresses.count(), 0)
        self.assertEqual(coop.people.count(), 0)
        self.assertEqual(coop.contact_methods.count(), 0)

    @patch('apps.directory.services.location_service.Nominatim')
    def test_create_full(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        request = {
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
                        "address": {
                            "street_address": "222 W. Merchandise Mart Plaza, Suite 1212",
                            "city": "Chicago",
                            "state": "IL",
                            "postal_code": "60654",
                            "country": "US"
                        }
                    },
                    {
                        "is_public": True,
                        "address": {
                            "street_address": "400 W 76th Street",
                            "city": "Chicago",
                            "state": "IL",
                            "postal_code": "60620",
                            "country": "US"
                        }
                    }
                ]
            }
        }

        response = self.client.post(reverse('coop-proposal'), request, format='json')

        self.assertEqual(CoopProposal.objects.count(), 1)
        self.assertEqual(CoopPublic.objects.count(), 0)
        self.assertEqual(Coop.objects.count(), 1)
        self.assertEqual(CoopType.objects.count(), 2)
        self.assertEqual(ContactMethod.objects.count(), 4)
        self.assertEqual(Person.objects.count(), 2)
        self.assertEqual(CoopAddressTags.objects.count(), 2)
        self.assertEqual(Address.objects.count(), 2)

        coop_proposal = CoopProposal.objects.get(pk=response.data['id'])
        self.assertEqual(coop_proposal.proposal_status, "PENDING")
        self.assertEqual(coop_proposal.operation, "CREATE")
        self.assertIsNotNone(coop_proposal.requested_datetime)
        self.assertEqual(coop_proposal.requested_by.username, self.user.username)
        self.assertIsNone(coop_proposal.reviewed_datetime)
        self.assertIsNone(coop_proposal.reviewed_by)
        self.assertIsNone(coop_proposal.review_notes)
        self.assertIsNone(coop_proposal.coop_public)

        coop = Coop.objects.get(pk=response.data['coop']['id'])
        self.assertEqual(coop.status, "PROPOSAL")
        self.assertIsNone(coop.coop_public)
        self.assertEqual(coop.name, request["coop"]["name"])
        self.assertEqual(coop.web_site, request["coop"]["web_site"])
        self.assertEqual(coop.description, request["coop"]["description"])
        self.assertEqual(coop.is_public, request["coop"]["is_public"])
        self.assertEqual(coop.scope, request["coop"]["scope"])
        self.assertEqual(coop.tags, request["coop"]["tags"])

        coop_types = coop.types.all()
        self.assertEqual(len(coop_types), 2)
        self.assertEqual(coop_types[0].name, request["coop"]["types"][0]["name"])
        self.assertEqual(coop_types[1].name, request["coop"]["types"][1]["name"])

        contact_methods = coop_proposal.coop.contact_methods.all()
        contact_methods_request = request["coop"]["contact_methods"]
        self.assertEqual(len(contact_methods), len(contact_methods_request))
        for j in range(len(contact_methods_request)):
            contactmethod_obj = contact_methods[j]
            contactmethod_request = contact_methods_request[j]
            if contactmethod_request["type"]=="EMAIL":
                self.assertEqual(contactmethod_obj.email, contactmethod_request["email"])
            if contactmethod_request["type"]=="PHONE":
                self.assertEqual(contactmethod_obj.phone, contactmethod_request["phone"])

        people = coop_proposal.coop.people.all()
        self.assertEqual(len(people), len(request["coop"]["people"]))
        for i in range(len(request["coop"]["people"])):
            person_obj = people[i]
            person_request = request["coop"]["people"][i]
            self.assertEqual(person_obj.first_name, person_request["first_name"])
            self.assertEqual(person_obj.last_name, person_request["last_name"])
            person_contactmethods_obj = person_obj.contact_methods.all()
            person_contactmethods_request = person_request["contact_methods"]
            for j in range(len(person_contactmethods_request)):
                person_contactmethod_obj = person_contactmethods_obj[j]
                person_contactmethod_request = person_contactmethods_request[j]
                if person_contactmethod_request["type"]=="EMAIL":
                    self.assertEqual(person_contactmethod_obj.email, person_contactmethod_request["email"])
                if person_contactmethod_request["type"]=="PHONE":
                    self.assertEqual(person_contactmethod_obj.phone, person_contactmethod_request["phone"])
        
        addresses = coop_proposal.coop.addresses.all()
        self.assertEqual(len(addresses), len(request["coop"]["addresses"]))
        for i in range(len(request["coop"]["addresses"])):
            self.assertEqual(addresses[i].address.street_address, request["coop"]["addresses"][i]["address"]["street_address"])
            self.assertEqual(addresses[i].address.city, request["coop"]["addresses"][i]["address"]["city"])
            self.assertEqual(addresses[i].address.state, request["coop"]["addresses"][i]["address"]["state"])
            self.assertEqual(addresses[i].address.postal_code, request["coop"]["addresses"][i]["address"]["postal_code"])
            self.assertEqual(addresses[i].address.country, request["coop"]["addresses"][i]["address"]["country"])
