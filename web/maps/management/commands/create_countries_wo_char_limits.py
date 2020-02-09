import pycountry
from django.core.management.base import BaseCommand, CommandError

from address.models import Country

class Command(BaseCommand):
    help = "Populates address.Country with data from pycountry."

    def handle(self, *args, **options):
        countries = [
            Country(
                code=country.alpha_2,
                name=country.name[:40],  # NOTE - concat to 40 chars because of limit on the model field
            )
            for country in pycountry.countries
        ]

        Country.objects.bulk_create(countries)
        self.stdout.write("Successfully added %s countries." % len(countries))

