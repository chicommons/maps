import pytest
from django.test import TestCase
from .factories import CoopTypeFactory, CoopFactory, AddressFactory, StateFactory
from directory.models import Coop, CoopType
from directory.serializers import *


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
    def test_coop_create(self):
        """ Test coop serizlizer model """
        state = StateFactory()
        serializer_data = {
            "name": "Test 8899",
            "types": [
                {"name": "Library"}
            ],
            "address": {
                "formatted": "222 W. Merchandise Mart Plaza, Suite 1212",
                "locality": {
                    "name": "Chicago",
                    "postal_code": "60654",
                    "state_id": state.id
                }
            },
            "enabled": "true",
            "phone": "7739441426",
            "email": "myemail",
            "web_site": "http://www.1871.com/"
        }

        serializer = CoopSerializer(data=serializer_data)
        serializer.is_valid()
        print(serializer.errors())
        assert serializer.is_valid(), serializer.errors()
        result = serializer.save() 
        print(result)
