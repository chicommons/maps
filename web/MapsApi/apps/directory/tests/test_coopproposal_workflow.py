from apps.directory.models import CoopProposal, CoopPublic, Coop, CoopType, ContactMethod, Address, CoopAddressTags, Person
from apps.directory.serializers import CoopProposalReviewSerializer, CoopProposalCreateSerializer
from rest_framework.test import APITestCase
from unittest.mock import patch
import pathlib

class TestCoopProposalWorkflow(APITestCase):
    @classmethod
    def setUpTestData(cls):
        pass

    def setUp(self):
        self.staging_dir_path = (pathlib.Path(__file__).parent / 'files' / 'staging').resolve()
        self.testcases_dir_path = (pathlib.Path(__file__).parent / 'files' / 'testcases').resolve()
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
        self.update_data = {
            "operation": "UPDATE",
            "coop_public_id": None,
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
                        "address": {
                            "street_address": "1345 W 19th Street",
                            "city": "Chicago",
                            "state": "IL",
                            "postal_code": "60608",
                            "country": "US"
                        }
                    },                    
                    {
                        "is_public": True,
                        "address": {
                            "street_address": "3500 S Lake Park Ave",
                            "city": "Chicago",
                            "state": "IL",
                            "postal_code": "60653",
                            "country": "US"
                        }
                    },
                    {
                        "is_public": True,
                        "address": {
                            "street_address": "6500 S Pulaski Rd",
                            "city": "Chicago",
                            "state": "IL",
                            "postal_code": "60629",
                            "country": "US"
                        }
                    }
                ]
            }
        }
        self.delete_data = {
            "operation": "DELETE",
            "coop_public_id": None
        }
        self.approval_data = {
            'id': None,
            'proposal_status': "APPROVED",
            'review_notes': "lgtm"
        }
        self.mock_raw_dict = {'lat': 37.4221, 'lon': -122.0841, 'place_id': 'XXXYYYYZZZ', 'address': {'county': 'Testing County'}}
  
    @patch('apps.directory.services.location_service.Nominatim')
    def test_CoopProposalCreateReviewWorkflow(self, mock_nominatim):
        # Setup mock response for Location Service's Geocode API (Nominatim)
        mock_nominatim.return_value.geocode.return_value.configure_mock(raw=self.mock_raw_dict)

        # ==============================
        #   Create proposal to Create
        # ==============================
        create_data = self.create_data

        coop_proposal_to_create_serializer = CoopProposalCreateSerializer(data=create_data)
        if coop_proposal_to_create_serializer.is_valid():
            coop_proposal = coop_proposal_to_create_serializer.save()
        else: 
            self.fail(coop_proposal_to_create_serializer.errors)

        # Validate CoopProposal
        self.assertEqual(CoopProposal.objects.filter(proposal_status="PENDING").count(), 1)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="APPROVED").count(), 0)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="REJECTED").count(), 0)

        # Validate CoopPublic
        self.assertEqual(CoopPublic.objects.filter(status="ACTIVE").count(), 0)
        self.assertEqual(CoopPublic.objects.filter(status="REMOVED").count(), 0)

        # Validate Coop
        self.assertEqual(Coop.objects.filter(status="ACTIVE").count(), 0)
        self.assertEqual(Coop.objects.filter(status="PROPOSAL").count(), 1)
        self.assertEqual(Coop.objects.filter(status="ARCHIVED").count(), 0)

        # ==============================
        #   Review proposal
        # ==============================
        approval_data = {
            'id': coop_proposal.id,
            'proposal_status': "APPROVED",
            'review_notes': "lgtm"
        }
        review_serializer = CoopProposalReviewSerializer(coop_proposal, data=approval_data)
        if review_serializer.is_valid():
            coop_proposal = review_serializer.save()
        else: 
            self.fail(review_serializer.errors)

        self.assertEqual(CoopProposal.objects.count(), 1)
        self.assertEqual(CoopPublic.objects.count(), 1)
        self.assertEqual(Coop.objects.count(), 1)
        self.assertEqual(CoopType.objects.count(), 2)
        self.assertEqual(ContactMethod.objects.count(), 4)
        self.assertEqual(Person.objects.count(), 2)
        self.assertEqual(CoopAddressTags.objects.count(), 2)
        self.assertEqual(Address.objects.count(), 2)

        # Validate CoopProposal
        self.assertEqual(CoopProposal.objects.filter(proposal_status="PENDING").count(), 0)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="APPROVED").count(), 1)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="REJECTED").count(), 0)
        self.assertEqual(coop_proposal.operation, "CREATE")
        self.assertEqual(coop_proposal.proposal_status, approval_data["proposal_status"])
        self.assertEqual(coop_proposal.review_notes, approval_data["review_notes"])
        self.assertEqual(coop_proposal.coop_public.id, coop_proposal.coop_public.id)       

        # Validate Coop
        self.assertEqual(Coop.objects.filter(status="ACTIVE").count(), 1)
        self.assertEqual(Coop.objects.filter(status="PROPOSAL").count(), 0)
        self.assertEqual(Coop.objects.filter(status="ARCHIVED").count(), 0)
        active_coop = Coop.objects.get(status="ACTIVE", coop_public_id=coop_proposal.coop_public.id)
        self.assertEqual(active_coop.status, "ACTIVE")
        self.assertEqual(active_coop.coop_public.id, coop_proposal.coop_public.id)

        # Validate CoopPublic
        self.assertEqual(CoopPublic.objects.filter(status="ACTIVE").count(), 1)
        self.assertEqual(CoopPublic.objects.filter(status="REMOVED").count(), 0)
        coop_public = coop_proposal.coop_public
        self.assertEqual(coop_public.status, "ACTIVE")

        # ==============================
        #   Create proposal to Update
        # ==============================

        update_data = self.update_data
        update_data["coop_public_id"] = coop_proposal.coop_public.id

        coop_proposal_to_update_serializer = CoopProposalCreateSerializer(data=update_data)
        if coop_proposal_to_update_serializer.is_valid():
            coop_proposal = coop_proposal_to_update_serializer.save()
        else: 
            self.fail(coop_proposal_to_update_serializer.errors)

        # Validate CoopProposal
        self.assertEqual(CoopProposal.objects.filter(proposal_status="PENDING").count(), 1)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="APPROVED").count(), 1)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="REJECTED").count(), 0)

        # Validate CoopPublic
        self.assertEqual(CoopPublic.objects.filter(status="ACTIVE").count(), 1)
        self.assertEqual(CoopPublic.objects.filter(status="REMOVED").count(), 0)
        coop_public = coop_proposal.coop_public
        self.assertEqual(coop_public.status, "ACTIVE")

        # Validate Coop
        self.assertEqual(Coop.objects.filter(status="ACTIVE").count(), 1)
        self.assertEqual(Coop.objects.filter(status="PROPOSAL").count(), 1)
        self.assertEqual(Coop.objects.filter(status="ARCHIVED").count(), 0)

        active_coop = Coop.objects.get(status="ACTIVE", coop_public_id=coop_proposal.coop_public.id)
        self.assertEqual(active_coop.status, "ACTIVE")
        self.assertIsNotNone(active_coop.coop_public)
        self.assertEqual(active_coop.coop_public.id, coop_public.id)
        self.assertEqual(active_coop.coop_public, coop_proposal.coop_public)

        # ==============================
        #   Review proposal
        # ==============================
        approval_data = self.approval_data
        approval_data["id"] = coop_proposal.id

        review_serializer = CoopProposalReviewSerializer(coop_proposal, data=approval_data)
        if review_serializer.is_valid():
            coop_proposal = review_serializer.save()
        else: 
            self.fail(review_serializer.errors)

        self.assertEqual(CoopProposal.objects.count(), 2)
        self.assertEqual(CoopPublic.objects.count(), 1)
        self.assertEqual(Coop.objects.count(), 2)
        self.assertEqual(CoopType.objects.count(), 5)
        self.assertEqual(ContactMethod.objects.count(), 12)
        self.assertEqual(Person.objects.count(), 6)
        self.assertEqual(CoopAddressTags.objects.count(), 5)
        self.assertEqual(Address.objects.count(), 5)

        self.assertEqual(CoopProposal.objects.filter(proposal_status="PENDING").count(), 0)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="APPROVED").count(), 2)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="REJECTED").count(), 0)

        self.assertEqual(Coop.objects.filter(status="ACTIVE").count(), 1)
        self.assertEqual(Coop.objects.filter(status="PROPOSAL").count(), 0)
        self.assertEqual(Coop.objects.filter(status="ARCHIVED").count(), 1)

        self.assertEqual(CoopPublic.objects.filter(status="ACTIVE").count(), 1)
        self.assertEqual(CoopPublic.objects.filter(status="REMOVED").count(), 0)

        coop = coop_proposal.coop
        self.assertEqual(coop.coop_public.id, coop_proposal.coop_public.id)
        self.assertEqual(coop.status, "ACTIVE")
        self.assertIsNotNone(coop.coop_public)
        self.assertEqual(coop.coop_public, coop_proposal.coop_public)

        archived_coop = Coop.objects.get(status="ARCHIVED", coop_public_id=coop_proposal.coop_public.id)
        self.assertEqual(archived_coop.status, "ARCHIVED")
        self.assertEqual(archived_coop.coop_public.id, coop_public.id)
        self.assertEqual(archived_coop.coop_public, coop_proposal.coop_public)

        coop_public = coop_proposal.coop_public
        self.assertEqual(coop_public.status, "ACTIVE")

        # ==============================
        #   Create proposal to Delete
        # ==============================
        delete_data = self.delete_data
        delete_data["coop_public_id"] = coop_proposal.coop_public.id

        coop_proposal_to_delete_serializer = CoopProposalCreateSerializer(data=delete_data)
        if coop_proposal_to_delete_serializer.is_valid():
            coop_proposal = coop_proposal_to_delete_serializer.save()
        else: 
            self.fail(coop_proposal_to_delete_serializer.errors)

        self.assertEqual(CoopProposal.objects.count(), 3)
        self.assertEqual(CoopPublic.objects.count(), 1)
        self.assertEqual(Coop.objects.count(), 2)
        self.assertEqual(CoopType.objects.count(), 5)
        self.assertEqual(ContactMethod.objects.count(), 12)
        self.assertEqual(Person.objects.count(), 6)
        self.assertEqual(CoopAddressTags.objects.count(), 5)
        self.assertEqual(Address.objects.count(), 5)

        self.assertEqual(CoopProposal.objects.filter(proposal_status="PENDING").count(), 1)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="APPROVED").count(), 2)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="REJECTED").count(), 0)

        self.assertEqual(Coop.objects.filter(status="ACTIVE").count(), 1)
        self.assertEqual(Coop.objects.filter(status="PROPOSAL").count(), 0)
        self.assertEqual(Coop.objects.filter(status="ARCHIVED").count(), 1)

        self.assertEqual(CoopPublic.objects.filter(status="ACTIVE").count(), 1)
        self.assertEqual(CoopPublic.objects.filter(status="REMOVED").count(), 0)

        self.assertEqual(coop_proposal.operation, "DELETE")

        coop_public = coop_proposal.coop_public
        self.assertEqual(coop_public.status, "ACTIVE")

        active_coop = Coop.objects.get(status="ACTIVE", coop_public_id=coop_proposal.coop_public.id)
        self.assertEqual(active_coop.status, "ACTIVE")
        self.assertIsNotNone(active_coop.coop_public)
        self.assertEqual(active_coop.coop_public.id, coop_public.id)
        self.assertEqual(active_coop.coop_public, coop_proposal.coop_public)

        # ==============================
        #   Review proposal
        # ==============================
        approval_data = self.approval_data
        approval_data["id"] = coop_proposal.id

        review_serializer = CoopProposalReviewSerializer(coop_proposal, data=approval_data)
        if review_serializer.is_valid():
            coop_proposal = review_serializer.save()
        else: 
            self.fail(review_serializer.errors)

        self.assertEqual(CoopProposal.objects.count(), 3)
        self.assertEqual(CoopPublic.objects.count(), 1)
        self.assertEqual(Coop.objects.count(), 2)
        self.assertEqual(CoopType.objects.count(), 5)
        self.assertEqual(ContactMethod.objects.count(), 12)
        self.assertEqual(Person.objects.count(), 6)
        self.assertEqual(CoopAddressTags.objects.count(), 5)
        self.assertEqual(Address.objects.count(), 5)

        self.assertEqual(CoopProposal.objects.filter(proposal_status="PENDING").count(), 0)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="APPROVED").count(), 3)
        self.assertEqual(CoopProposal.objects.filter(proposal_status="REJECTED").count(), 0)

        self.assertEqual(Coop.objects.filter(status="ACTIVE").count(), 0)
        self.assertEqual(Coop.objects.filter(status="PROPOSAL").count(), 0)
        self.assertEqual(Coop.objects.filter(status="ARCHIVED").count(), 2)

        self.assertEqual(CoopPublic.objects.filter(status="ACTIVE").count(), 0)
        self.assertEqual(CoopPublic.objects.filter(status="REMOVED").count(), 1)

