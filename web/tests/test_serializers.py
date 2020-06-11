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
    def test_coop_type_create(self):
        """ Test coop serizlizer model """
        name = "Library"
        serializer_data = {
            "name": name,
        }

        serializer = CoopTypeSerializer(data=serializer_data)
        serializer.is_valid()
        print(serializer.errors)
        assert serializer.is_valid(), serializer.errors
        coop_type = serializer.save() 
        assert coop_type.name == name

    @pytest.mark.django_db
    def test_coop_type_create_with_existing(self):
        """ Test coop type serizlizer model if there is already a coop type by that name """
        coop_type = CoopTypeFactory()
        serializer_data = {
            "name": coop_type.name,
        }

        serializer = CoopTypeSerializer(data=serializer_data)
        serializer.is_valid()
        assert serializer.is_valid(), serializer.errors
        result = serializer.save() 
        assert result.name == coop_type.name


    @pytest.mark.django_db
    def test_coop_create(self):
        """ Test coop serizlizer model """
        print("\n\n\n\n========= start ===========\n")
        name = "Test 8899"
        coop_type_name = "Library"
        street = "222 W. Merchandise Mart Plaza, Suite 1212"
        city = "Chicago"
        postal_code = "60654"
        enabled = True
        postal_code = "60654"
        email = "myemail@hello.com"
        phone = "7739441426"
        web_site = "http://www.1871.com"
        state = StateFactory()
        serializer_data = {
            "name": name,
            "types": [
                {"name": coop_type_name}
            ],
            "addresses": [{
                "formatted": street,
                "locality": {
                    "name": city,
                    "postal_code": postal_code, 
                    "state_id": state.id
                }
            }],
            "enabled": enabled,
            "phone": phone,
            "email": email,
            "web_site": web_site
        }

        serializer = CoopSerializer(data=serializer_data)
        serializer.is_valid()
        assert serializer.is_valid(), serializer.errors
        coop = serializer.save() 
        assert coop.name == name
        type_count = 0
        for coop_type in coop.types.all():
            assert coop_type.name == coop_type_name
            type_count = type_count + 1
        assert type_count == 1
        assert coop.addresses.first().locality.name == city
        assert coop.addresses.first().locality.postal_code == postal_code
        assert coop.addresses.first().locality.state.id == state.id
        assert coop.enabled == enabled
        assert coop.phone == phone
        assert coop.email == email
        assert coop.web_site == web_site 
