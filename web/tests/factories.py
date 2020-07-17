import factory
from django.db import models
from directory.models import CoopType, Coop, ContactMethod, Person
from address.models import AddressField, Address
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

    class Meta:
        model = 'address.Address'

    street_number = "123"
    route = "Rd"
    raw = "123 Fake Rd" 
    formatted = "123 Fake Rd." 
    latitude = 87.1234
    longitude = -100.12342
    locality = factory.SubFactory(LocalityFactory)


class PhoneContactMethodFactory(factory.DjangoModelFactory):
    """
        Define Contact Method Factory for a phone number 
    """
    class Meta:
        model = ContactMethod

    type = ContactMethod.ContactTypes.EMAIL
    phone = "8005551234"


class EmailContactMethodFactory(factory.DjangoModelFactory):
    """
        Define Contact Method Factory for emails 
    """
    class Meta:
        model = ContactMethod

    type = ContactMethod.ContactTypes.EMAIL
    email = "test@example.com"


class CoopTypeFactory(factory.DjangoModelFactory):
    """
        Define Coop Type Factory
    """
    class Meta:
        model = CoopType

    name = "test name"


class CoopFactory(factory.DjangoModelFactory):
    """
        Define Coop Factory
    """
    class Meta:
        model = Coop

    name = "test model"
    enabled = True
    phone = factory.SubFactory(PhoneContactMethodFactory)
    email = factory.SubFactory(EmailContactMethodFactory) 
    web_site = "http://www.hello.com"

    @factory.post_generation
    def addresses(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of types were passed in, use them
            for address in extracted:
                self.addresses.add(address)
        else:
            address = AddressFactory()
            self.addresses.add( address )

    @factory.post_generation
    def types(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of types were passed in, use them
            for _ in range(extracted):
            #for type in extracted:
                self.types.add(CoopTypeFactory())
        #else:
        #    print("Creating type ...\n")
        #    type = CoopTypeFactory()
        #    self.types.add( type )


class PersonFactory(factory.DjangoModelFactory):
    """
        Define Person Factory
    """
    class Meta:
        model = Person

    first_name = "first name"
    last_name = "last name"

    @factory.post_generation
    def contact_methods(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of contact methods were passed in, use them
            for contact_method in extracted:
                self.contact_methods.add(contact_method)
        else:
            contact_method = ContactMethodFactory()
            self.contact_methods.add( contact_method )

    @factory.post_generation
    def coops(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            print("calling this branch ...")
            # A list of coops were passed in, use them
            for _ in range(extracted):
            #for coop in extracted:
                self.coops.add(coop)
        else:
            coop = CoopFactory()
            self.coops.add( coop )

