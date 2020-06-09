from django.core.management import call_command
from django.core.management.base import BaseCommand

from address.models import State, Country, Locality, Address
from directory.models import Coop, CoopType

class Command(BaseCommand):

    def handle(self, *args, **options):
        self.stdout.write('Deleting existing data')
        if CoopType.objects.exists():
            CoopType.objects.all().delete()
        if Coop.objects.exists():
            Coop.objects.all().delete()
        if Address.objects.exists():
            Address.objects.all().delete()
        if Locality.objects.exists():
            Locality.objects.all().delete()
        if State.objects.exists():
            State.objects.all().delete()
        if Country.objects.exists():
            Country.objects.all().delete()
        self.stdout.write('Seeding initial data')
        call_command('loaddata', 'directory/fixtures/country_data.yaml')
        call_command('loaddata', 'directory/fixtures/state_data.yaml')
        call_command('loaddata', 'directory/fixtures/seed_data.yaml')

