from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from address.models import Address
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField
from address.models import State, Country, Locality
from django.db.models import Prefetch
from django.utils.timezone import now

class ContactMethod(models.Model):
    class ContactTypes(models.TextChoices):
        EMAIL = 'EMAIL', _('Email')
        PHONE = 'PHONE', _('Phone')

    is_public = models.BooleanField(default=True, null=False)
    type = models.CharField(
        null=False,
        max_length=5,
        choices=ContactTypes.choices,
    )
    phone = PhoneNumberField(null=True)
    email = models.EmailField(null=True)
    coops = models.ManyToManyField('Coop')
    email_is_public = models.BooleanField(default=True, null=False)
    phone_is_public = models.BooleanField(default=True, null=False)

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
        qset = Coop.objects.filter(types__name=type,
                                   enabled=True)
        return qset

    def find(
        self,
        partial_name,
        types_arr=None,
        enabled=None,
        city=None,
        zip=None,
        street=None,
        state_abbrev=None
    ):
        """
        Lookup coops by varying criteria.
        """
        q = Q()
        if partial_name:
            q &= Q(name__icontains=partial_name)
        if enabled != None:
            q &= Q(enabled=enabled)
        if types_arr != None:
            filter = Q(
                *[('types__name', type) for type in types_arr],
                _connector=Q.OR
            )
            q &= filter
        if street != None:
            q &= Q(addresses__raw__icontains=street)
        if city != None:
            q &= Q(addresses__locality__name__iexact=city)
        if zip != None:
            q &= Q(addresses__locality__postal_code=zip)
        if state_abbrev != None:
            q &= Q(addresses__locality__state__code=state_abbrev)
            q &= Q(addresses__locality__state__country__code="US")

        addressTagsPrefetcher = Prefetch('coopaddresstags_set', queryset=CoopAddressTags.objects.select_related('address', 'address__locality', 'address__locality__state', 'address__locality__state__country'))
        queryset = Coop.objects.filter(q).prefetch_related(addressTagsPrefetcher, 'types')
        
        phonePrefetcher = Prefetch('phone', queryset=ContactMethod.objects.all())
        emailPrefetcher = Prefetch('email', queryset=ContactMethod.objects.all())
        queryset = queryset.prefetch_related(phonePrefetcher).prefetch_related(emailPrefetcher)
        print(queryset.query)
        return queryset

    # Meant to look up coops case-insensitively by part of a type
    def contains_type(self, types_arr):
        filter = Q(
            *[('types__name__icontains', type) for type in types_arr],
            _connector=Q.OR
        )
        queryset = Coop.objects.filter(filter, enabled=True)
        return queryset

    def find_wo_coords(self):
        """
        Look up coops with addresses that don't have either a latitude
        or a longitude.
        """
        queryset = Coop.objects.filter(
            Q(addresses__latitude__isnull=True) |
            Q(addresses__longitude__isnull=True)
        )
        return queryset

    def find_unapproved(self):
        """
        Return all coops whose approved fields are set to False
        """
        queryset = Coop.objects.filter(
            approved=False
        )
        return queryset


class Coop(models.Model):
    objects = CoopManager()
    name = models.CharField(max_length=250, null=False)
    types = models.ManyToManyField(CoopType, blank=False)
    addresses = models.ManyToManyField(Address, through='CoopAddressTags')
    enabled = models.BooleanField(default=True, null=False)
    phone = models.ManyToManyField(ContactMethod, null=True, related_name='contact_phone')
    email = models.ManyToManyField(ContactMethod, null=True, related_name='contact_email')
    web_site = models.TextField()
    description = models.TextField(null=True)
    approved = models.BooleanField(default=False, null=True)
    proposed_changes = models.JSONField("Proposed Changes", null=True)
    reject_reason = models.TextField(null=True)
    coop_public = models.BooleanField(default=True, null=False)
    status = models.TextField(null=True)
    scope = models.TextField(null=True)
    tags = models.TextField(null=True)
    rec_source = models.TextField(null=True)
    rec_updated_by = models.ManyToManyField(User, null=True)
    rec_updated_date = models.DateTimeField(default=now, blank=True)

    def apply_proposed_changes(self):
        proposed = self.proposed_changes
        self.name = proposed.get('name')
        self.web_site = proposed.get('web_site')
        for type in proposed.get('types'):
            self.types.add(CoopType.objects.get(name=type))
        self.save()  

class CoopAddressTags(models.Model):
    # Retain referencing coop & address, but set "is_public" relation to NULL
    coop = models.ForeignKey(Coop, on_delete=models.SET_NULL, null=True)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    is_public = models.BooleanField(default=True, null=False)

class Person(models.Model):
    first_name = models.CharField(max_length=250, null=False)
    last_name = models.CharField(max_length=250, null=False)
    coops = models.ManyToManyField(Coop, related_name='people')
    contact_methods = models.ManyToManyField(ContactMethod)
    is_public = models.BooleanField(default=True, null=False)


def country_get_by_natural_key(self, name):
    return self.get_or_create(name=name)[0]

Country.add_to_class("get_by_natural_key", country_get_by_natural_key)

def state_get_by_natural_key(self, code, country):
  country = Country.objects.get_or_create(name=country)[0]
  return State.objects.get_or_create(code=code, country=country)[0]

class StateCustomManager(models.Manager):
    def get_by_natural_key(self, code, country):
        country = Country.objects.get_or_create(name=country)[0]
        return State.objects.get_or_create(code=code, country=country)[0]

State.add_to_class('objects', StateCustomManager())

class LocalityCustomManager(models.Manager):
    def get_by_natural_key(self, city, postal_code, state):
        return Locality.objects.get_or_create(name=city, postal_code=postal_code, state=state)[0]

#setattr(Locality._meta, 'default_manager', LocalityCustomManager())
