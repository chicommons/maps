import re
import csv
import sys
from ruamel.yaml import YAML
from ruamel.yaml.reader import Reader
import codecs
from operator import itemgetter
from yaml import load, dump
from yaml import Loader, Dumper
from commons.util.case_insensitive_set import CaseInsensitiveSet
from ...services.location_service import LocationService
from django.core.management.base import BaseCommand
from yaml import load

  
class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('file')

    def handle(*args, **options):
        # Output BOM
        print(codecs.BOM_UTF8.decode("UTF-8")) 

        yaml = YAML(typ='safe')
        file_path = str(options['file'])

        city_pks = Command.get_city_pks(file_path)
        address_pks = Command.get_address_pks(file_path, city_pks)

        input_file = csv.DictReader(open(file_path))
        # Key is coop name and key is a list of types
        types_hash = {}
        k = 1  # ID counter
        for row in input_file:
            try:
                id = row['ID'].strip().encode("utf-8", 'ignore').decode("utf-8")
            except KeyError:
                id = k
                k += 1
            name = row['name'].strip().encode("utf-8", 'ignore').decode("utf-8")
            type = re.sub(
                r"^\s+", "", row['type'].strip().encode("utf-8", 'ignore').decode("utf-8"), flags=re.UNICODE
            )
            if type:
                if not name in types_hash.keys():
                    types_hash[name] = CaseInsensitiveSet()
                types = types_hash[name]
                types.add(type) 

        input_file = csv.DictReader(open(file_path))
        k = 1  # ID counter
        for row in input_file:
            try:
                id = row['ID'].strip().encode("utf-8", 'ignore').decode("utf-8")
            except KeyError:
                id = k
                k += 1
            name = row['name'].strip().encode("utf-8", 'ignore').decode("utf-8")
            if name in types_hash.keys():
                types = types_hash[name]
                state_id = row['st'].strip().encode("utf-8", 'ignore').decode("utf-8")
                phone = row['Telephone Number'].strip().encode("utf-8", 'ignore').decode("utf-8")
                email = row['Email-Address'].strip().encode("utf-8", 'ignore').decode("utf-8")
                web_site = row['website'].strip().encode('ascii','ignore').decode('ascii')
                lat = row['lat'].strip().encode("utf-8", 'ignore').decode("utf-8")
                lon = row['lon'].strip().encode("utf-8", 'ignore').decode("utf-8")
                address_pk = address_pks.get(tuple([lat, lon])) 
                enabled = row['check'].lower() == 'yes'
                if address_pk:
                    # Output the contact methods
                    if email:
                        contact_email_pk = int(id) * 2
                        print("- model: directory.contactmethod")
                        print("  pk:",contact_email_pk)
                        print("  fields:")
                        print("    type: \"EMAIL\"")
                        print("    email:",email)

                    if phone:
                        print("- model: directory.contactmethod")
                        contact_phone_pk = int(id) * 2 + 1
                        print("  pk:",contact_phone_pk)
                        print("  fields:")
                        print("    type: \"PHONE\"")
                        print("    phone:",phone)

                    # Output the coop
                    print("- model: directory.coop")
                    print("  pk:",id)
                    print("  fields:")
                    print("    name: \"",name,"\"", sep='')
                    print("    types:")
                    print("    - ['", "','".join(types), "']", sep='') 
                    print("    addresses: [", address_pk, "]")
                    #print("    - [", address_pk, "]")                    
                    print("    enabled:",enabled)
                    if phone:
                        print("    phone:",contact_phone_pk)
                    if email:
                        print("    email:",contact_email_pk)
                    print("    web_site: \"",web_site,"\"", sep='')

    @staticmethod
    def strip_invalid(s):
        res = ''
        for x in s:
            if Reader.NON_PRINTABLE.match(x):
                # res += '\\x{:x}'.format(ord(x))
                continue
            res += x
        return res

    @staticmethod
    def get_address_pks(file_path, city_pks):
        input_file = csv.DictReader(open(file_path))
        i=1
        address_pks = dict()
        for row in input_file:
            street = load(Command.strip_invalid(row['address'].strip().encode("utf-8", 'ignore').decode("utf-8"))) 
            parts = street.split(" ") if street is not None else ["None"]
            num = parts[0]
            route = parts[-1]
            city = row['city1'].strip().title().encode("utf-8", 'ignore').decode("utf-8")
            postal_code = row['postal code'].strip().encode("utf-8", 'ignore').decode("utf-8")
            state_id = row['st'].strip().encode("utf-8", 'ignore').decode("utf-8")
            try:
                lat = row['lat'].strip().encode("utf-8", 'ignore').decode("utf-8")
                lon = row['lon'].strip().encode("utf-8", 'ignore').decode("utf-8")
                # If there are no lat or lon coords provided, attempt to figure
                # them out
                if not lat or not lon:
                    svc = LocationService()
                    ret = svc.get_coords(
                        street,
                        city,
                        postal_code,
                        state_id,
                        "USA"
                    )
#                    if ret:
#                        print("ret: %s" % ret)
#                        lat = ret[0]
#                        lon = ret[1]

                if float(lat) != 0 and float(lon) != 0:
                    print("- model: address.address")
                    print("  pk:",i)
                    print("  fields:")
                    print("    street_number:",num)
                    print("    route:",route)
                    print("    raw: ",street, sep='')
                    print("    formatted: ",street, sep='')
                    city_pk = city_pks[tuple([city, postal_code, state_id.title()])]
                    print("    locality:", city_pk)
                    print("    latitude:",lat)
                    print("    longitude:",lon)
                    address_pks[tuple([lat, lon])] = i 
                    i = i + 1
            except ValueError:
                pass
        return address_pks

    @staticmethod
    def get_city_pks(file_path):
        input_file = csv.DictReader(open(file_path))
        upper = lambda k: lambda d: {**d, k: d[k].upper()}
        res = map(upper('st'), input_file)
        cities = {tuple(d[i].strip().title() for i in ["city1", "postal code", "st"]) for d in res}
        i=1
        cities_pks = dict()
        country = "United States"
        for city_set in cities:
            city = list(city_set)[0]
            zipcode = list(city_set)[1]
            state_id = list(city_set)[2].upper() if list(city_set)[2] != '' else 'IL'
            print("- model: address.locality")
            print("  pk:",i)
            print("  fields:")
            print("    name: \"",city,"\"", sep='')
            print("    postal_code: \"",zipcode,"\"", sep='')
            print("    state: ['", state_id, "', '", country, "']", sep='')
#            print("    state: 19313")
            cities_pks[tuple(city_set)] = i 
            i = i + 1
        return cities_pks
 
