from apps.directory.models import CoopProposal, CoopPublic, Coop, CoopType, ContactMethod, Address, CoopAddressTags, Person, User
from rest_framework.test import APITestCase
from unittest.mock import patch
import pathlib
from . import helpers
from django.urls import reverse
from rest_framework import status

class TestCoopProposalUpdate(APITestCase):
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
                    {"first_name": "John", "last_name": "Doe", "is_public": True, "contact_methods": []}, 
                    {"first_name": "Steve", "last_name": "Smith", "is_public": True, "contact_methods": [
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
    def test_update_empty(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        request = {
            "operation": "UPDATE",
            "coop_public_id": self.coop_public_id,
            "coop": {
            }
        }

        response = self.client.post(reverse('coop-proposal'), request, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(self.client._credentials['HTTP_AUTHORIZATION'], f'Bearer {self.token}')

        self.assertEqual(CoopProposal.objects.count(), 2)
        self.assertEqual(CoopPublic.objects.count(), 1)
        self.assertEqual(Coop.objects.count(), 2)
        self.assertEqual(CoopType.objects.count(), 2)
        self.assertEqual(ContactMethod.objects.count(), 4)
        self.assertEqual(Person.objects.count(), 2)
        self.assertEqual(CoopAddressTags.objects.count(), 2)
        self.assertEqual(Address.objects.count(), 2)

        coop_proposal = CoopProposal.objects.get(pk=response.data['id'])
        self.assertEqual(coop_proposal.proposal_status, "PENDING")
        self.assertEqual(coop_proposal.operation, "UPDATE")
        self.assertIsNotNone(coop_proposal.requested_datetime)
        self.assertEqual(coop_proposal.requested_by.username, self.user.username)
        self.assertIsNone(coop_proposal.reviewed_datetime)
        self.assertIsNone(coop_proposal.reviewed_by)
        self.assertIsNone(coop_proposal.review_notes)
        self.assertEqual(coop_proposal.coop_public.id, self.coop_public_id)

        coop = Coop.objects.get(pk=response.data['coop']['id'])
        self.assertEqual(coop.status, "PROPOSAL")
        self.assertEqual(coop.coop_public.id, self.coop_public_id)
        self.assertEqual(coop.name, self.create_data["coop"]["name"])
        self.assertEqual(coop.web_site, self.create_data["coop"]["web_site"])
        self.assertEqual(coop.description, self.create_data["coop"]["description"])
        self.assertEqual(coop.is_public, self.create_data["coop"]["is_public"])
        self.assertEqual(coop.scope, self.create_data["coop"]["scope"])
        self.assertEqual(coop.tags, self.create_data["coop"]["tags"])

        coop_types = coop.types.all()
        self.assertEqual(len(coop_types), 2)
        self.assertEqual(coop_types[0].name, self.create_data["coop"]["types"][0]["name"])
        self.assertEqual(coop_types[1].name, self.create_data["coop"]["types"][1]["name"])

        addresses = coop.addresses.all()
        self.assertEqual(len(addresses), len(self.create_data["coop"]["addresses"]))
        for i in range(len(self.create_data["coop"]["addresses"])):
            address_obj = addresses[i].address
            address_request = self.create_data["coop"]["addresses"][i]["address"]
            self.assertEqual(address_obj.street_address, address_request["street_address"])
            self.assertEqual(address_obj.city, address_request["city"])
            self.assertEqual(address_obj.state, address_request["state"])
            self.assertEqual(address_obj.postal_code, address_request["postal_code"])
            self.assertEqual(address_obj.country, address_request["country"])

        people = coop.people.all()
        self.assertEqual(len(people), len(self.create_data["coop"]["people"]))
        for i in range(len(self.create_data["coop"]["people"])):
            person_obj = people[i]
            person_request = self.create_data["coop"]["people"][i]
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
        
        contact_methods = coop.contact_methods.all()
        contact_methods_request = self.create_data["coop"]["contact_methods"]
        self.assertEqual(len(contact_methods), len(contact_methods_request))
        for j in range(len(contact_methods_request)):
            contactmethod_obj = contact_methods[j]
            contactmethod_request = contact_methods_request[j]
            if contactmethod_request["type"]=="EMAIL":
                self.assertEqual(contactmethod_obj.email, contactmethod_request["email"])
            if contactmethod_request["type"]=="PHONE":
                self.assertEqual(contactmethod_obj.phone, contactmethod_request["phone"])

    @patch('apps.directory.services.location_service.Nominatim')
    def test_update_basic(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        update_data = {
            "operation": "UPDATE",
            "coop_public_id": self.coop_public_id,
            "coop": {
                "name": "Test Max 8888",
                "web_site": "http://www.example.com/",
                "description": "Testing",
                "is_public": True,
                "scope": "Testing Testing", #TODO - What are acceptable values?
                "tags": "tag1, tag2, tag3, tag4" #TODO - What are acceptable values?
            }
        }

        response = self.client.post(reverse('coop-proposal'), update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(self.client._credentials['HTTP_AUTHORIZATION'], f'Bearer {self.token}')

        self.assertEqual(CoopProposal.objects.count(), 2)
        self.assertEqual(CoopPublic.objects.count(), 1)
        self.assertEqual(Coop.objects.count(), 2)
        self.assertEqual(CoopType.objects.count(), 2)
        self.assertEqual(ContactMethod.objects.count(), 4)
        self.assertEqual(Person.objects.count(), 2)
        self.assertEqual(CoopAddressTags.objects.count(), 2)
        self.assertEqual(Address.objects.count(), 2)

        coop_proposal = CoopProposal.objects.get(pk=response.data['id'])
        self.assertEqual(coop_proposal.proposal_status, "PENDING")
        self.assertEqual(coop_proposal.operation, "UPDATE")
        self.assertIsNotNone(coop_proposal.requested_datetime)
        self.assertEqual(coop_proposal.requested_by.username, self.user.username)
        self.assertIsNone(coop_proposal.reviewed_datetime)
        self.assertIsNone(coop_proposal.reviewed_by)
        self.assertIsNone(coop_proposal.review_notes)
        self.assertEqual(coop_proposal.coop_public.id, self.coop_public_id)

        coop = Coop.objects.get(pk=response.data['coop']['id'])
        self.assertEqual(coop.status, "PROPOSAL")
        self.assertEqual(coop.coop_public.id, self.coop_public_id)
        self.assertEqual(coop.name, update_data["coop"]["name"])
        self.assertEqual(coop.web_site, update_data["coop"]["web_site"])
        self.assertEqual(coop.description, update_data["coop"]["description"])
        self.assertEqual(coop.is_public, update_data["coop"]["is_public"])
        self.assertEqual(coop.scope, update_data["coop"]["scope"])
        self.assertEqual(coop.tags, update_data["coop"]["tags"])

        coop_types = coop.types.all()
        self.assertEqual(len(coop_types), 2)
        self.assertEqual(coop_types[0].name, self.create_data["coop"]["types"][0]["name"])
        self.assertEqual(coop_types[1].name, self.create_data["coop"]["types"][1]["name"])

        addresses = coop.addresses.all()
        self.assertEqual(len(addresses), len(self.create_data["coop"]["addresses"]))
        for i in range(len(self.create_data["coop"]["addresses"])):
            address_obj = addresses[i].address
            address_request = self.create_data["coop"]["addresses"][i]["address"]
            self.assertEqual(address_obj.street_address, address_request["street_address"])
            self.assertEqual(address_obj.city, address_request["city"])
            self.assertEqual(address_obj.state, address_request["state"])
            self.assertEqual(address_obj.postal_code, address_request["postal_code"])
            self.assertEqual(address_obj.country, address_request["country"])

        people = coop.people.all()
        self.assertEqual(len(people), len(self.create_data["coop"]["people"]))
        for i in range(len(self.create_data["coop"]["people"])):
            person_obj = people[i]
            person_request = self.create_data["coop"]["people"][i]
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
        
        contact_methods = coop.contact_methods.all()
        contact_methods_request = self.create_data["coop"]["contact_methods"]
        self.assertEqual(len(contact_methods), len(contact_methods_request))
        for j in range(len(contact_methods_request)):
            contactmethod_obj = contact_methods[j]
            contactmethod_request = contact_methods_request[j]
            if contactmethod_request["type"]=="EMAIL":
                self.assertEqual(contactmethod_obj.email, contactmethod_request["email"])
            if contactmethod_request["type"]=="PHONE":
                self.assertEqual(contactmethod_obj.phone, contactmethod_request["phone"])
    
    @patch('apps.directory.services.location_service.Nominatim')
    def test_update_full(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        update_data = {
            "operation": "UPDATE",
            "coop_public_id": self.coop_public_id,
            "coop": {
                "name": "Test Max 8888",
                "web_site": "http://www.example.com/",
                "description": "Testing",
                "is_public": True,
                "scope": "Testing Testing", #TODO - What are acceptable values?
                "tags": "tag1, tag2, tag3, tag4", #TODO - What are acceptable values?
                "types": [ {"name": "Aquarium"}, {"name": "Park"}, {"name": "Arboretum"} ],
                "contact_methods": [
                    { "type": "EMAIL", "is_public": True, "email": "myemail2@example.com" },
                    { "type": "PHONE", "is_public": True, "phone": "+17739441427" },
                    { "type": "EMAIL", "is_public": True, "email": "myemail3@example.com" },
                    { "type": "PHONE", "is_public": True, "phone": "+17739441428" }
                ],
                "people": [
                    {"first_name": "Debra", "last_name": "Silverstein", "is_public": False, "contact_methods": []}, 
                    {"first_name": "Maria", "last_name": "Hadden", "is_public": False, "contact_methods": [
                        { "type": "PHONE", "is_public": True, "phone": "+13125555551" }
                    ]}, 
                    {"first_name": "Matt", "last_name": "Martin", "is_public": False, "contact_methods": [
                        { "type": "EMAIL", "is_public": True, "email": "example3@example.com" }
                    ]}, 
                    {"first_name": "Leni", "last_name": "Manna-Hoppenworth", "is_public": False, "contact_methods": [
                        { "type": "EMAIL", "is_public": True, "email": "example4@example.com" },
                        { "type": "PHONE", "is_public": True, "phone": "+13125555552" }
                    ]}
                ],
                "addresses": [
                    {
                        "is_public": True,
                        "address": { "street_address": "1345 W 19th Street", "city": "Chicago", "state": "IL", "postal_code": "60608", "country": "US" }
                    },                    
                    {
                        "is_public": True,
                        "address": { "street_address": "3500 S Lake Park Ave", "city": "Chicago", "state": "IL", "postal_code": "60653", "country": "US" }
                    },
                    {
                        "is_public": True,
                        "address": { "street_address": "6500 S Pulaski Rd", "city": "Chicago", "state": "IL", "postal_code": "60629", "country": "US" }
                    }
                ]
            }
        }

        response = self.client.post(reverse('coop-proposal'), update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(self.client._credentials['HTTP_AUTHORIZATION'], f'Bearer {self.token}')

        self.assertEqual(CoopProposal.objects.count(), 2)
        self.assertEqual(CoopPublic.objects.count(), 1)
        self.assertEqual(Coop.objects.count(), 2)
        self.assertEqual(CoopType.objects.count(), 5)
        self.assertEqual(ContactMethod.objects.count(), 12)
        self.assertEqual(Person.objects.count(), 6)
        self.assertEqual(CoopAddressTags.objects.count(), 5)
        self.assertEqual(Address.objects.count(), 5)

        coop_proposal = CoopProposal.objects.get(pk=response.data['id'])
        self.assertEqual(coop_proposal.proposal_status, "PENDING")
        self.assertEqual(coop_proposal.operation, "UPDATE")
        self.assertIsNotNone(coop_proposal.requested_datetime)
        self.assertEqual(coop_proposal.requested_by.username, self.user.username)
        self.assertIsNone(coop_proposal.reviewed_datetime)
        self.assertIsNone(coop_proposal.reviewed_by)
        self.assertIsNone(coop_proposal.review_notes)
        self.assertEqual(coop_proposal.coop_public.id, self.coop_public_id)
    
        coop = Coop.objects.get(pk=response.data['coop']['id'])
        self.assertEqual(coop.status, "PROPOSAL")
        self.assertEqual(coop.coop_public.id, self.coop_public_id)
        self.assertEqual(coop.name, update_data["coop"]["name"])
        self.assertEqual(coop.web_site, update_data["coop"]["web_site"])
        self.assertEqual(coop.description, update_data["coop"]["description"])
        self.assertEqual(coop.is_public, update_data["coop"]["is_public"])
        self.assertEqual(coop.scope, update_data["coop"]["scope"])
        self.assertEqual(coop.tags, update_data["coop"]["tags"])

        coop_types = coop.types.all()
        self.assertEqual(len(coop_types), 3)
        self.assertEqual(coop_types[0].name, update_data["coop"]["types"][0]["name"])
        self.assertEqual(coop_types[1].name, update_data["coop"]["types"][1]["name"])
        self.assertEqual(coop_types[2].name, update_data["coop"]["types"][2]["name"])

        addresses = coop.addresses.all()
        self.assertEqual(len(addresses), len(update_data["coop"]["addresses"]))
        for i in range(len(update_data["coop"]["addresses"])):
            address_obj = addresses[i].address
            address_request = update_data["coop"]["addresses"][i]["address"]
            self.assertEqual(address_obj.street_address, address_request["street_address"])
            self.assertEqual(address_obj.city, address_request["city"])
            self.assertEqual(address_obj.state, address_request["state"])
            self.assertEqual(address_obj.postal_code, address_request["postal_code"])
            self.assertEqual(address_obj.country, address_request["country"])

        people = coop.people.all()
        self.assertEqual(len(people), len(update_data["coop"]["people"]))
        for i in range(len(update_data["coop"]["people"])):
            person_obj = people[i]
            person_request = update_data["coop"]["people"][i]
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
        
        contact_methods = coop.contact_methods.all()
        contact_methods_request = update_data["coop"]["contact_methods"]
        self.assertEqual(len(contact_methods), len(contact_methods_request))
        for j in range(len(contact_methods_request)):
            contactmethod_obj = contact_methods[j]
            contactmethod_request = contact_methods_request[j]
            if contactmethod_request["type"]=="EMAIL":
                self.assertEqual(contactmethod_obj.email, contactmethod_request["email"])
            if contactmethod_request["type"]=="PHONE":
                self.assertEqual(contactmethod_obj.phone, contactmethod_request["phone"])

    @patch('apps.directory.services.location_service.Nominatim')
    def test_update_emptyarrays(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        update_data = {
            "operation": "UPDATE",
            "coop_public_id": self.coop_public_id,
            "coop": {
                "name": "Test Max 8888",
                "web_site": "http://www.example.com/",
                "description": "Testing",
                "is_public": True,
                "scope": "Testing Testing", #TODO - What are acceptable values?
                "tags": "tag1, tag2, tag3, tag4", #TODO - What are acceptable values?
                "types": [],
                "contact_methods": [],
                "people": [],
                "addresses": []
            }
        }

        response = self.client.post(reverse('coop-proposal'), update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(self.client._credentials['HTTP_AUTHORIZATION'], f'Bearer {self.token}')

        self.assertEqual(CoopProposal.objects.count(), 2)
        self.assertEqual(CoopPublic.objects.count(), 1)
        self.assertEqual(Coop.objects.count(), 2)
        self.assertEqual(CoopType.objects.count(), 2)
        self.assertEqual(ContactMethod.objects.count(), 4)
        self.assertEqual(Person.objects.count(), 2)
        self.assertEqual(CoopAddressTags.objects.count(), 2)
        self.assertEqual(Address.objects.count(), 2)

        coop_proposal = CoopProposal.objects.get(pk=response.data['id'])
        self.assertEqual(coop_proposal.proposal_status, "PENDING")
        self.assertEqual(coop_proposal.operation, "UPDATE")
        self.assertIsNotNone(coop_proposal.requested_datetime)
        self.assertEqual(coop_proposal.requested_by.username, self.user.username)
        self.assertIsNone(coop_proposal.reviewed_datetime)
        self.assertIsNone(coop_proposal.reviewed_by)
        self.assertIsNone(coop_proposal.review_notes)
        self.assertEqual(coop_proposal.coop_public.id, self.coop_public_id)
    
        coop = Coop.objects.get(pk=response.data['coop']['id'])
        self.assertEqual(coop.status, "PROPOSAL")
        self.assertEqual(coop.coop_public.id, self.coop_public_id)
        self.assertEqual(coop.name, update_data["coop"]["name"])
        self.assertEqual(coop.web_site, update_data["coop"]["web_site"])
        self.assertEqual(coop.description, update_data["coop"]["description"])
        self.assertEqual(coop.is_public, update_data["coop"]["is_public"])
        self.assertEqual(coop.scope, update_data["coop"]["scope"])
        self.assertEqual(coop.tags, update_data["coop"]["tags"])

        coop_types = coop.types.all()
        self.assertEqual(len(coop_types), 0)

        addresses = coop.addresses.all()
        self.assertEqual(len(addresses), 0)

        people = coop.people.all()
        self.assertEqual(len(people), 0)
        
        contact_methods = coop.contact_methods.all()
        self.assertEqual(len(contact_methods), 0)
