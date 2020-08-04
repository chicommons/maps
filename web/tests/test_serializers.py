import pytest
from django.test import TestCase
from .factories import CoopTypeFactory, CoopFactory, AddressFactory, StateFactory, EmailContactMethodFactory, PhoneContactMethodFactory
from directory.models import Coop, CoopType
from directory.serializers import *


class SerializerTests(TestCase):
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
    def test_address_create(self):
        """ Test address serizlizer model """
        street = "222 W. Merchandise Mart Plaza, Suite 1212"
        city = "Chicago"
        postal_code = "60654"
        enabled = True
        postal_code = "60654"
        state = StateFactory()
        serializer_data = {
            "raw": street,
            "formatted": street,
            "locality": {
                "name": city,
                "postal_code": postal_code, 
                "state": {
                  "id": state.id, 
                  "country": {
                    "id": state.country.id, 
                    "name": state.country.name
                  }
                }
            }
        }

        serializer = AddressSerializer(data=serializer_data)
        assert serializer.is_valid(), serializer.errors
        address_saved = serializer.save() 

    @pytest.mark.django_db
    def test_coop_create(self):
        """ Test coop serizlizer model """
        name = "Test 8899"
        coop_type_name = "Library"
        street = "222 W. Merchandise Mart Plaza, Suite 1212"
        city = "Chicago"
        postal_code = "60654"
        enabled = True
        postal_code = "60654"
        email = "test@example.com"
        phone = "7732441468"
        web_site = "http://www.1871.com"
        state = StateFactory()
        serializer_data = {
            "name": name,
            "types": [
                {"name": coop_type_name}
            ],
            "addresses": [{
                "raw": street,
                "formatted": street,
                "locality": {
                    "name": city,
                    "postal_code": postal_code, 
                    "state": {
                      "id": state.id, 
                      "country": {
                        "id": state.country.id, 
                        "name": state.country.name
                      }
                    }
                }
            }],
            "enabled": enabled,
            "phone": {
              "phone": phone
            },
            "email": {
              "email": email
            },
            "web_site": web_site
        }

        serializer = CoopSerializer(data=serializer_data)
        assert serializer.is_valid(), serializer.errors
        coop_saved = serializer.save() 
        coop = Coop.objects.get(pk=coop_saved.id) 
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
        assert coop.phone.phone == phone
        assert coop.email.email == email
        assert coop.web_site == web_site 

    @pytest.mark.django_db
    def test_coop_update(self):
        """ Test coop serizlizer model """
        coop = CoopFactory()
        name = "Update 8899"
        coop_type_name = "Test type"
        street = "123 Beverly St."
        city = "Beverly Hills"
        postal_code = "60654"
        enabled = True
        postal_code = "60654"
        email = "test@example.com"
        phone = "7732441468"
        web_site = "http://www.1871.com"
        state = coop.addresses.all().first().locality.state #StateFactory()
        serializer_data = {
            "id": id,
            "name": name,
            "types": [
                {"name": coop_type_name}
            ],
            "addresses": [{
                "id": coop.addresses.all().first().id,
                "formatted": street,
                "locality": {
                    "name": city,
                    "postal_code": postal_code, 
                    "state": state.id
                }
            }],
            "enabled": enabled,
            "phone": {
              "phone": phone
            },
            "email": {
              "email": email
            },
            "web_site": web_site
        }

        serializer = CoopSerializer(data=serializer_data)
        assert serializer.is_valid(), serializer.errors
        coop_saved = serializer.save() 
        coop = Coop.objects.get(pk=coop_saved.id) 
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
        assert coop.phone.phone == phone
        assert coop.email.email == email
        assert coop.web_site == web_site 

    @pytest.mark.django_db
    def test_coop_create_no_coop_types(self):
        """ Test coop serizlizer model """
        name = "Test 8899"
        street = "222 W. Merchandise Mart Plaza, Suite 1212"
        city = "Chicago"
        postal_code = "60654"
        enabled = True
        postal_code = "60654"
        email = "test@example.com"
        phone = "7732441468"
        web_site = "http://www.1871.com"
        state = StateFactory()
        serializer_data = {
            "name": name,
            "types": [
            ],
            "addresses": [{
                "formatted": street,
                "locality": {
                    "name": city,
                    "postal_code": postal_code, 
                    "state": state.id
                }
            }],
            "enabled": enabled,
            "phone": {
              "phone": phone
            },
            "email": {
              "email": email
            },
            "web_site": web_site
        }

        serializer = CoopSerializer(data=serializer_data)
        assert not serializer.is_valid(), "Failed to indicate data was invalid." 
        assert serializer.errors['types']['non_field_errors'][0].code == "empty", serializer.errors['types']['non_field_errors'][0]

    @pytest.mark.django_db
    def test_coop_create_with_no_state(self):
        """ Test coop serizlizer model """
        name = "Test 8899"
        coop_type_name = "Library"
        street = "222 W. Merchandise Mart Plaza, Suite 1212"
        city = "Chicago"
        postal_code = "60654"
        enabled = True
        postal_code = "60654"
        email = "test@example.com"
        phone = "7739441422"
        web_site = "http://www.1871.com"
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
                    "state": ''
                }
            }],
            "enabled": enabled,
            "phone": {
              "phone": phone
            },
            "email": {
              "email": email
            },
            "web_site": web_site
        }

        serializer = CoopSerializer(data=serializer_data)
        assert not serializer.is_valid()
        assert len(serializer.errors.keys()) == 1
        assert serializer.errors['addresses']['state'] == "This field is required.", serializer.errors['addresses']['state']


    @pytest.mark.django_db
    def test_coop_create_with_invalid_phone(self):
        """ Test coop serizlizer model """
        name = "Test 8899"
        coop_type_name = "Library"
        street = "222 W. Merchandise Mart Plaza, Suite 1212"
        city = "Chicago"
        postal_code = "60654"
        enabled = True
        postal_code = "60654"
        email = "test@example.com"
        phone = "7771112222"
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
                    "state": state.id
                }
            }],
            "enabled": enabled,
            "phone": {
              "phone": phone
            },
            "email": {
              "email": email
            },
            "web_site": web_site
        }

        serializer = CoopSerializer(data=serializer_data)
        assert not serializer.is_valid()
        assert len(serializer.errors.keys()) == 1, "number of failures {} errors {}".format(len(serializer.errors.keys()), serializer.errors) 
        assert serializer.errors['phone']['phone'][0].code == "invalid_phone_number"


    @pytest.mark.django_db
    def test_person_create(self):
        """ Test person serizlizer model """
        first_name = "Moe"
        last_name = "Howard"
        email = "test@example.com"
        coop = CoopFactory()
        serializer_data = {
            "first_name": first_name,
            "last_name": last_name,
            "coops": [
                coop.id 
            ],
            "contact_methods": [{
                "email": email,
                "type": "EMAIL"
            }],
        }

        serializer = PersonSerializer(data=serializer_data)
        serializer.is_valid()
        assert serializer.is_valid(), serializer.errors
        person = serializer.save() 
        assert person.first_name == first_name
        assert person.last_name == last_name
        coop_count = 0
        for coop in person.coops.all():
            coop_count = coop_count + 1
        assert coop_count == 1
        assert person.contact_methods.first().email == email
