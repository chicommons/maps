from address.models import Country
from pycountry import countries
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Initialize Country model'

    def handle(self, *args, **kwargs):
        create_countries = [
            Country(name=country.name, code=country.alpha_2)
            for country in countries
        ]
        Country.objects.bulk_create(create_countries)
        self.stdout.write(f'Created {len(countries)} countries.\n')

