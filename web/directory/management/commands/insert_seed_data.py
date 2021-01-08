from django.core.management import call_command
from django.core.management.base import BaseCommand

from address.models import State, Country, Locality, Address
from directory.models import Coop, CoopType, StateCustomManager, LocalityCustomManager 

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('seed_file', type=str, nargs='?', default='directory/fixtures/seed_data.yaml')
        parser.add_argument('recreate_country_and_state_data', type=str, nargs='?', default='true')

    def handle(self, *args, **options):
        setattr(State._meta, 'default_manager', StateCustomManager())
        setattr(Locality._meta, 'default_manager', LocalityCustomManager())

        seed_data_file = options.get('seed_file')
        print("seed file %s" % seed_data_file)
        recreate_country_and_state_data = options.get('recreate_country_and_state_data').lower() == 'true' 

        if recreate_country_and_state_data:
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
        call_command('loaddata', seed_data_file)

