from django.core.management import call_command
from django.core.management.base import BaseCommand

from address.models import State, Country, Locality, Address
from directory.models import Coop, CoopType

class Command(BaseCommand):

    def handle(self, *args, **options):
        self.stdout.write('Deleting existing data')
        CoopType.objects.all().delete()
        Coop.objects.all().delete()
        Address.objects.all().delete()
        Locality.objects.all().delete()
        State.objects.all().delete()
        Country.objects.all().delete()
        self.stdout.write('Seeding initial data')
        call_command('loaddata', 'directory/fixtures/country_data.yaml')
        call_command('loaddata', 'directory/fixtures/state_data.yaml')
        call_command('loaddata', 'directory/fixtures/seed_data.yaml')

