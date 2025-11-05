from django.core.management.base import BaseCommand

from apps.directory.models import Coop, CoopType, Address, CoopAddressTags, ContactMethod, AddressCache, Person, CoopProposal, CoopPublic

class Command(BaseCommand):

    def handle(self, *args, **options):
        self.stdout.write('Deleting existing data')
        if Person.objects.exists():
            Person.objects.all().delete()
        if CoopType.objects.exists():
            CoopType.objects.all().delete()
        if ContactMethod.objects.exists():
            ContactMethod.objects.all().delete()
        if AddressCache.objects.exists():
            AddressCache.objects.all().delete()
        if Address.objects.exists():
            Address.objects.all().delete()
        if CoopAddressTags.objects.exists():
            CoopAddressTags.objects.all().delete()
        if CoopProposal.objects.exists():
            CoopProposal.objects.all().delete()
        if Coop.objects.exists():
            Coop.objects.all().delete()
        if CoopPublic.objects.exists():
            CoopPublic.objects.all().delete()