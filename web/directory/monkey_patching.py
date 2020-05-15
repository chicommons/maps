from address import State
from address import Country

def country_get_by_natural_key(self, name):
    return self.get_or_create(name=name)[0]

#def get_by_natural_key(self, state_name, country):
#    country = Country.objects.get_or_create(name=country)
#    state = State.objects.get_or_create(name=state_name)
#    return self.get_or_create(state=state, country=country)[0]

Country.add_to_class("get_by_natural_key",country_get_by_natural_key)
#State.add_to_class("get_by_natural_key",state_get_by_natural_key)

class CustomManager(models.Manager):
    def get_by_natural_key(self, state_name, country):
        country = Country.objects.get_or_create(name=country)[0]
        print(country)
        return State.objects.get_or_create(name=state_name, country=country)[0]

State.add_to_class('objects', CustomManager())
# As django use default manager during data deserilization, oveeride it too
State.add_to_class('_default_manager', CustomManager())

