from django.db import models

from address.models import AddressField
from phonenumber_field.modelfields import PhoneNumberField


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
 
