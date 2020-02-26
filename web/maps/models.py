from django.db import models

from address.models import AddressField
from phonenumber_field.modelfields import PhoneNumberField
from address.models import State, Country, Locality


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

Country.add_to_class("get_by_natural_key",country_get_by_natural_key)

class StateCustomManager(models.Manager):
    def get_by_natural_key(self, state_name, country):
        country = Country.objects.get_or_create(name=country)[0]
        return State.objects.get_or_create(name=state_name, country=country)[0]

setattr(State._meta, 'default_manager', StateCustomManager())

class LocalityCustomManager(models.Manager):
    def get_by_natural_key(self, city, postal_code, state):
        state = State.objects.get(id=state)[0]
        return Locality.objects.get_or_create(city=city, postal_code=postal_code, state=state)[0]

setattr(Locality._meta, 'default_manager', LocalityCustomManager())


