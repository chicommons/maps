import pytest
from django.test import TestCase
from .factories import CoopTypeFactory, CoopFactory, AddressFactory
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
        print("\n\n\n\n-------- starting test ....]n")
        coop = CoopFactory.create(types=[])
        coop.full_clean()
        print("size: ", coop.types.all().count())
        print("first: ", coop.types.all().first())
        self.assertIsNotNone(coop)
        self.assertIsNone( coop.id )
        print("========= end of test ==============\n\n\n\n\n")
 

