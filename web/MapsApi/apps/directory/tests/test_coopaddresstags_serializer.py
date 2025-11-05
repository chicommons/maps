from apps.directory.models import CoopAddressTags, Address
from apps.directory.serializers import CoopAddressTagsSerializer
from rest_framework.test import APITestCase

class TestCoopAddressTagsSerializer(APITestCase):
    @classmethod
    def setUpTestData(cls):
        pass

    def setUp(self):
        pass

    def test_create(self):
        cat_data = {
            "is_public": True,
            "address": {
                "street_address": "222 W. Merchandise Mart Plaza, Suite 1212",
                "city": "Chicago",
                "state": "IL",
                "postal_code": "60654",
                "country": "US"
            }
        }

        cat_serializer = CoopAddressTagsSerializer(data = cat_data)
        if cat_serializer.is_valid():
            cat = cat_serializer.save()
        else: 
            raise       

        self.assertEqual(CoopAddressTags.objects.count(), 1)
        self.assertEqual(Address.objects.count(), 1) 

        new_cat = CoopAddressTags.objects.get(pk=cat.id)
        self.assertEqual(new_cat.is_public, cat_data["is_public"])
        new_address = new_cat.address
        address_data = cat_data["address"]
        self.assertEqual(new_address.street_address, address_data["street_address"]) 
        self.assertEqual(new_address.postal_code, address_data["postal_code"]) 
        self.assertEqual(new_address.city, address_data["city"]) 
        self.assertEqual(new_address.state, address_data["state"]) 
        self.assertEqual(new_address.country, address_data["country"]) 


    def test_update(self):
        cat_create_data = {
            "is_public": False,
            "address": {
                "street_address": "222 W. Merchandise Mart Plaza, Suite 1212",
                "city": "Chicago",
                "state": "IL",
                "postal_code": "60654",
                "country": "US"
            }
        }
        cat_serializer = CoopAddressTagsSerializer(data = cat_create_data)
        if cat_serializer.is_valid():
            cat = cat_serializer.save()
        else: 
            self.fail("Invalid CAT Creation")

        cat_update_data = {
            "is_public": True,
            "address": {
                "street_address": "2800 N California Ave",
                "city": "Chicago",
                "state": "IL",
                "postal_code": "60618",
                "country": "US"
            }
        }
        cat_serializer = CoopAddressTagsSerializer(cat, data=cat_update_data)
        if cat_serializer.is_valid():
            cat = cat_serializer.save()
        else: 
            self.fail("Invalid CAT Update")
        
        self.assertEqual(CoopAddressTags.objects.count(), 1)
        self.assertEqual(Address.objects.count(), 1) 

        new_cat = CoopAddressTags.objects.get(pk=cat.id)
        self.assertEqual(new_cat.is_public, cat_update_data["is_public"])
        new_address = new_cat.address
        address_data=cat_update_data["address"]
        self.assertEqual(new_address.street_address, address_data["street_address"]) 
        self.assertEqual(new_address.postal_code, address_data["postal_code"]) 
        self.assertEqual(new_address.city, address_data["city"]) 
        self.assertEqual(new_address.state, address_data["state"]) 
        self.assertEqual(new_address.country, address_data["country"]) 