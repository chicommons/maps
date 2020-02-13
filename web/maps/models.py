from django.db import models

from address.models import AddressField
from phonenumber_field.modelfields import PhoneNumberField
from address.models import State
from address.models import Country


class CoopTypeManager(models.Manager):

    def get_by_natural_key(self, name):
        return self.get_or_create(name=name)[0]


class CoopType(models.Model):
    name = models.CharField(max_length=200, null=False)

    objects = CoopTypeManager()

    class Meta:
        unique_together = ("name",)


class Coop(models.Model):
    name = models.CharField(max_length=250, null=False)
    type = models.ForeignKey(CoopType, on_delete=None) 
    address = AddressField(on_delete=models.CASCADE)
    enabled = models.BooleanField(default=True, null=False)
    phone = PhoneNumberField(null=True)
    email = models.EmailField(null=True)
    web_site = models.TextField()

def country_get_by_natural_key(self, name):
    return self.get_or_create(name=name)[0]

#def get_by_natural_key(self, state_name, country):
#    country = Country.objects.get_or_create(name=country)
#    state = State.objects.get_or_create(name=state_name)
#    return self.get_or_create(state=state, country=country)[0]

Country.add_to_class("get_by_natural_key",country_get_by_natural_key)
#State.add_to_class("get_by_natural_key",state_get_by_natural_key)

class CustomManager(models.Manager):
    def get_by_natural_key(self, state_name, country):
        country = Country.objects.get_or_create(name=country)[0]
        print(country)
        return State.objects.get_or_create(name=state_name, country=country)[0]

State.add_to_class('objects', CustomManager())
# As django use default manager during data deserilization, oveeride it too
State.add_to_class('_default_manager', CustomManager())

 
