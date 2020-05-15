from django.core.management import call_command
from django.core.management.base import BaseCommand

from address.models import Country

class Command(BaseCommand):

    def handle(self, *args, **options):
        if not Country.objects.exists():
            self.stdout.write('Seeding initial data')
            call_command('loaddata', 'directory/fixtures/country_data.yaml')
            call_command('loaddata', 'directory/fixtures/state_data.yaml')
            call_command('loaddata', 'directory/fixtures/seed_data.yaml')

