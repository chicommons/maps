# This script is used to create the states.yml file.  You should never need to execute
# this script.
from address.models import Country, State
from pycountry import countries, subdivisions
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Initialize State model'

    def handle(self, *args, **kwargs):
        states = [] 
        keys = set()
        for subdivision in subdivisions:
            name = subdivision.name
            country_code = subdivision.country_code
            country_state_code = subdivision.code
            state_code = country_state_code.split("-")[1]
            country = Country.objects.get(code=country_code) 
            state = State(name=name, code=state_code, country=country)
            key = str(country.id) + "-" + name
            if key not in keys:
                states.append(state)
                keys.add(key)

        State.objects.bulk_create(states)
        self.stdout.write(f'Created {len(states)} states.\n')

