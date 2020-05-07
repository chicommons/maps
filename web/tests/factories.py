import factory
from django.db import models
from maps.models import CoopType, Coop
from address.models import AddressField
from phonenumber_field.modelfields import PhoneNumberField
from address.models import State, Country, Locality


class CountryFactory(factory.DjangoModelFactory):
    """
        Define Country Factory
    """
    class Meta:
        model = Country

    name = "Narnia"
    code = "NN"


class StateFactory(factory.DjangoModelFactory):
    """
        Define State Factory
    """
    class Meta:
        model = State 

    name = "Narnia"
    code = "NN"
    country = factory.SubFactory(CountryFactory) 


class LocalityFactory(factory.DjangoModelFactory):
    """
        Define Locality Factory
    """
    class Meta:
        model = Locality 

    name = "Narnia"
    postal_code = "60605"
    state = factory.SubFactory(StateFactory) 

class AddressFactory(factory.DjangoModelFactory):
    """
        Define Address Factory
    """
    objects = models.Manager()

    class Meta:
        model = AddressField

    street_number = "123"
    route = "Rd"
    raw = "123 Fake Rd" 
    formatted = "123 Fake Rd." 
    latitude = 87.1234
    longitude = -100.12342
    locality = factory.SubFactory(LocalityFactory)


class CoopTypeFactory(factory.DjangoModelFactory):
    """
        Define Coop Type Factory
    """
    class Meta:
        model = CoopType


class CoopFactory(factory.DjangoModelFactory):
    """
        Define Coop Factory
    """
    class Meta:
        model = Coop

    name = "test model"
    address = factory.SubFactory(AddressFactory)
    enabled = True
    phone = "312-999-1234"
    email = "test@hello.com"
    web_site = "http://www.hello.com"

    @factory.post_generation
    def types(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of groups were passed in, use them
            for type in extracted:
                self.types.add(type)
        else:
            type = factory.SubFactory(CoopTypeFactory)
            self.types.add( type )
