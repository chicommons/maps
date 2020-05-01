import pytest
from django.test import TestCase
from .factories import CoopTypeFactory, CoopFactory


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
    def test_coop_type_model(self):
        """ Test customer model """    # create customer model instance
        coop_type = CoopTypeFactory(name="Test Coop Type Name")
        assert coop_type.name == "Test Coop Type Name"

