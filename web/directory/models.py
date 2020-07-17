from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _

from address.models import Address
from phonenumber_field.modelfields import PhoneNumberField
from address.models import State, Country, Locality


class ContactMethod(models.Model):
    class ContactTypes(models.TextChoices):
        EMAIL = 'EMAIL', _('Email')
        PHONE = 'PHONE', _('Phone')

    type = models.CharField(
        null=False,
        max_length=5,
        choices=ContactTypes.choices,
    )
    phone = PhoneNumberField(null=True)
    email = models.EmailField(null=True)

    class Meta:
        unique_together = ('phone', 'email',)


class CoopTypeManager(models.Manager):

    def get_by_natural_key(self, name):
        return self.get_or_create(name=name)[0]


class CoopType(models.Model):
    name = models.CharField(max_length=200, null=False)

    objects = CoopTypeManager()

    class Meta:
        # Creates a new unique constraint with the `name` field
        constraints = [models.UniqueConstraint(fields=['name'], name='coop_type_unq')]


class CoopManager(models.Manager):
    # Look up by coop type
    def get_by_type(self, type):
        qset = Coop.objects.filter(type__name=type,
                                   enabled=True)
        return qset

    # Look up coops by a partial name (case insensitive)
    def find_by_name(self, partial_name):
        queryset = Coop.objects.filter(name__icontains=partial_name, enabled=True)
        print(queryset.query)
        return queryset

    # Meant to look up coops case-insensitively by part of a type
    def contains_type(self, types_arr):
        filter = Q(
            *[('types__name__icontains', type) for type in types_arr],
            _connector=Q.OR
        )
        queryset = Coop.objects.filter(filter,
                                       enabled=True)
        return queryset
        

class Coop(models.Model):
    objects = CoopManager()
    name = models.CharField(max_length=250, null=False)
    types = models.ManyToManyField(CoopType, blank=False)
    addresses = models.ManyToManyField(Address)
    enabled = models.BooleanField(default=True, null=False)
    phone = models.ForeignKey(ContactMethod, on_delete=models.CASCADE, null=True, related_name='contact_phone')
    email = models.ForeignKey(ContactMethod, on_delete=models.CASCADE, null=True, related_name='contact_email')
    web_site = models.TextField()


class Person(models.Model):
    first_name = models.CharField(max_length=250, null=False)
    last_name = models.CharField(max_length=250, null=False)
    coops = models.ManyToManyField(Coop)
    contact_methods = models.ManyToManyField(ContactMethod)


def country_get_by_natural_key(self, name):
    return self.get_or_create(name=name)[0]

Country.add_to_class("get_by_natural_key",country_get_by_natural_key)

class StateCustomManager(models.Manager):
    def get_by_natural_key(self, code, country):
        country = Country.objects.get_or_create(name=country)[0]
        return State.objects.get_or_create(code=code, country=country)[0]

setattr(State._meta, 'default_manager', StateCustomManager())

class LocalityCustomManager(models.Manager):
    def get_by_natural_key(self, city, postal_code, state):
        return Locality.objects.get_or_create(city=city, postal_code=postal_code, state=state)[0]

setattr(Locality._meta, 'default_manager', LocalityCustomManager())


