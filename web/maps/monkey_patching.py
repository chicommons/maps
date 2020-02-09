from address import State
from address import Country

def country_get_by_natural_key(self, name):
    return self.get_or_create(name=name)[0]

def state_get_by_natural_key(self, name, country_id):
    return self.get_or_create(name=name, country_id=country_id)[0]

Country.add_to_class("get_by_natural_key",country_get_by_natural_key)
State.add_to_class("get_by_natural_key",state_get_by_natural_key)

