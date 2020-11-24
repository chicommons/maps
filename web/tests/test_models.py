import pytest
from django.test import TestCase
from .factories import CoopTypeFactory, CoopFactory, AddressFactory, PhoneContactMethodFactory 
from directory.models import Coop, CoopType


class ModelTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        print("setUpTestData: Run once to set up non-modified data for all class methods.")
        #management.call_command('loaddata', 'test_data.yaml', verbosity=0)
        pass

    def setUp(self):
        print("setUp: Run once for every test method to setup clean data.")
        #management.call_command('flush', verbosity=0, interactive=False)
        pass

    @pytest.mark.django_db
    def test_phone_create(self):
        """ Test phone contact method """    # create phone instance
        phone_num = "7739441467"
        phone = PhoneContactMethodFactory.create(phone=phone_num) 
        assert phone_num == phone.phone
        assert phone.id is not None

    @pytest.mark.django_db
    def test_phone_create_invalid_num(self):
        """ Test phone contact method """    # create phone instance
        phone_num = "abcdefsfdsf"
        phone = PhoneContactMethodFactory.create(phone=phone_num) 
        assert phone_num == phone.phone  
        assert phone.id is not None
        print("\n\n\n\n-------------id is ", id) 

    @pytest.mark.django_db
    def test_coop_type_create(self):
        """ Test coop type model """    # create customer model instance
        coop_type = CoopTypeFactory(name="Test Coop Type Name")
        assert coop_type.name == "Test Coop Type Name"

    @pytest.mark.django_db
    def test_address_create(self):
        """ Test address model """    # create customer model instance
        address = AddressFactory()
        assert address is not None

    @pytest.mark.django_db
    def test_coop_create(self):
        """ Test customer model """    # create customer model instance
        coop_from_factory = CoopFactory()
        self.assertIsNotNone(coop_from_factory)

        coop = Coop.objects.create(name='test')
        coop.addresses.set(coop_from_factory.addresses.all()) 
        self.assertIsNotNone(coop)

    @pytest.mark.django_db
    def test_coop_create_with_existing_type(self):
        """ Test customer model """    # create customer model instance
        coop_from_factory = CoopFactory()
        self.assertIsNotNone(coop_from_factory)

        coop_types = coop_from_factory.types
        coop = CoopFactory.create(types=[coop_types.all().first()], addresses=coop_from_factory.addresses.all())
        self.assertIsNotNone(coop)

    @pytest.mark.django_db
    def test_coop_create_with_no_types(self):
        """ Test customer model """    # create customer model instance
        print("\n\n\n\n**********-------- starting test ....\n")
        coop = CoopFactory.build(types=[])
        print("phone:",coop.phone.phone)
        print("email:",coop.email.email)
        coop.full_clean()
        self.assertIsNotNone(coop)
        self.assertIsNone( coop.id )

    def test_search_coops_wo_coords(self):
        """
        Look for coops with addresses without latitude/longitude coords
        """
        address = AddressFactory(latitude=None, longitude=None)
        coop_from_factory = CoopFactory(addresses=[address])
        # Verify coop appears when we search for those without a lat/lon
        coops = Coop.objects.find_wo_coords()
        results = list(coops)
        assert len(results) > 0, "Failed to find any matching results."
        assert coop_from_factory in list(coops), "Failed to find coop."
 

