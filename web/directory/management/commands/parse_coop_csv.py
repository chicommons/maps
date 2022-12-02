import re
import csv   
import sys
import pandas as pd
import os
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

        # generate unique index keys on demand
        def getID(IDset: set, ixPoint):
            while ixPoint in IDset:
                ixPoint+=1
            IDset.add(ixPoint)
            return ixPoint

        input_file = csv.DictReader(open(file_path))
        # Key is coop name and key is a list of types
        name={};
        type={};
        names_hash = {}
        types_hash = {}
        IDs = set()
        iPoint=0
        IDerr=0
        nList=[]
        for row in input_file:
            id = row['ID'].strip().encode("utf-8", 'ignore').decode("utf-8")
            name = row['ent-name'].strip().encode("utf-8", 'ignore').decode("utf-8")
            type = re.sub(
                r"^\s+", "", row['ent-type'].strip().encode("utf-8", 'ignore').decode("utf-8"), flags=re.UNICODE
            )
            # names is new 10/20/22
            if name:
                nList.append(name)
                if not name in names_hash.keys():
                    names_hash[name] = CaseInsensitiveSet()
                names = names_hash[name]
                names.add(name) 
            if type:
                if not type in types_hash.keys():
                    types_hash[type] = CaseInsensitiveSet()
                types = types_hash[type]
                types.add(type) 
            # set of IDs
            if id in IDs:
                # currently this error flag is not used
                IDerr+=1
            else:
                IDs.add(id)
        nkList=list(names_hash.keys())

        input_file = csv.DictReader(open(file_path))
        coop_id_pretable=[]
        for row in input_file:
            id = row['ID'].strip().encode("utf-8", 'ignore').decode("utf-8")
            name = row['ent-name'].strip().encode("utf-8", 'ignore').decode("utf-8")
            is_pub = load(Command.strip_invalid(row['ent-adrs-pub'].strip().encode("utf-8", 'ignore').decode("utf-8"))) 
            address=row['ent-adrs'].strip().encode("utf-8", 'ignore').decode("utf-8")
            try:
                coop_id=nkList.index(name)
            except:
                coop_id=9999
            
            # currently coop_id is numeric and id is string.
            coop_id_pretable.append([coop_id, id, name, address])

            if name in types_hash.keys():
                types = types_hash[name]
                state_id = row['ent-st'].strip().encode("utf-8", 'ignore').decode("utf-8")
                # Expecting 'end-phone-pub' to change name to 'ent-phone-pub'
                try:
                    phone_pub = row['ent-phone-pub'].strip().encode("utf-8", 'ignore').decode("utf-8")
                except KeyError:
                    phone_pub = row['end-phone-pub'].strip().encode("utf-8", 'ignore').decode("utf-8")
                if phone_pub.lower() != 'no':
                    phone = row['ent-phone'].strip().encode("utf-8", 'ignore').decode("utf-8")
                # Expecting 'ent-email-pub' to be included in the .csv file in later versions.

                try:
                    email_pub = row['ent-email-pub'].strip().encode("utf-8", 'ignore').decode("utf-8")
                except KeyError:
                    email_pub =  'yes'
                if email_pub.lower() != 'no':
                    email = row['ent-email'].strip().encode("utf-8", 'ignore').decode("utf-8")

                try:
                    adrs_pub = row['ent-adrs-pub'].strip().encode("utf-8", 'ignore').decode("utf-8")
                except KeyError:
                    adrs_pub =  'no'
                adrs_pub = adrs_pub == 'yes'

                web_site = row['website'].strip().encode('ascii','ignore').decode('ascii')
                lat = row['lat'].strip().encode("utf-8", 'ignore').decode("utf-8")
                lon = row['lon'].strip().encode("utf-8", 'ignore').decode("utf-8")
                address_pk = address_pks.get(id) 
                enabled = row['ent-include'].lower() == 'yes'
                if address_pk:
                    # Output the contact methods
                    if email:
                        #contact_email_pk = int(id) * 2 + 1
                        iPoint=getID(IDs,iPoint)
                        contact_email_pk = int(iPoint)
                        print("- model: directory.contactmethod")
                        print("  pk:",contact_email_pk)
                        print("  fields:")
                        print("    type: \"EMAIL\"")
                        print("    email:",email)

                    if phone:
                        print("- model: directory.contactmethod")
                        #contact_phone_pk = int(id) * 2 + 1
                        iPoint=getID(IDs,iPoint)
                        contact_phone_pk=int(iPoint)
                        print("  pk:",contact_phone_pk)
                        print("  fields:")
                        print("    type: \"PHONE\"")
                        print("    phone:",phone)

                    # Output the coop
                    print("- model: directory.coop")
                    #print("  pk:",id)
                    print("  pk:",coop_id)
                    print("  fields:")
                    print("    name: \"",name,"\"", sep='')
                    print("    types:")
                    for entry in types:
                        print("    - ['", entry, "']", sep='') 
                    #print("    addresses: [", address_pk, "]")                   
                    print("    enabled:",enabled)
                    if phone:
                        print("    phone:",contact_phone_pk)
                    if email:
                        print("    email:",contact_email_pk)
                    print("    web_site: \"",web_site,"\"", sep='')

                    # new model to link addresses: 9/15/2022
                    print("- model: directory.coopaddresstags")
                    iPoint=getID(IDs,iPoint)
                    add_tag_pk=int(iPoint) 
                    print("  pk:", add_tag_pk)
                    print("  fields:")
                    print("    is_public:", adrs_pub)
                    print("    coop_id:", coop_id)
                    print("    address_id:", address_pk)
            
        # create defacto coop unique names df
        coop_id_table=pd.DataFrame(coop_id_pretable, columns=['coop_id','location_id','coop_name','coop_address'])

        # check duplicates and multiple locations
        unique_names=coop_id_table.groupby("coop_name").size().to_frame().reset_index().set_axis(["coop_name","count"], axis=1)
        mult_locs_chk=unique_names.loc[unique_names['count']>1].merge(coop_id_table,on='coop_name')

        # check duplicate addresses
        unique_adds=coop_id_table.groupby("coop_address").size().to_frame().reset_index().set_axis(["coop_address","count"], axis=1)
        mult_adds_chk=unique_adds.loc[unique_adds['count']>1].merge(coop_id_table,on='coop_address')

        # write out results
        dirpath = os.getcwd()
        coop_id_table.to_csv(os.path.join(dirpath,"/tmp/coop_id_table.csv"))
        mult_locs_chk.to_csv(os.path.join(dirpath,"/tmp/mult_locs_chk.csv"))
        mult_adds_chk.to_csv(os.path.join(dirpath,"/tmp/mult_adds_chk.csv"))

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
            street = load(Command.strip_invalid(row['ent-adrs'].strip().encode("utf-8", 'ignore').decode("utf-8"))) 
            parts = street.split(" ") if street is not None else ["None"]
            num = parts[0]
            route = parts[-1]
            city = row['ent-city'].strip().title().encode("utf-8", 'ignore').decode("utf-8")
            postal_code = row['ent-zip'].strip().encode("utf-8", 'ignore').decode("utf-8")
            state_id = row['ent-st'].strip().encode("utf-8", 'ignore').decode("utf-8")
            # Don't output an address if no street, city, postal code or state is provided
            if not (street and city and postal_code and state_id):
                continue 
            try:
                id = row['ID'].strip().encode("utf-8", 'ignore').decode("utf-8")
                lat = row['lat'].strip().encode("utf-8", 'ignore').decode("utf-8")
                lon = row['lon'].strip().encode("utf-8", 'ignore').decode("utf-8")
                # If there are no lat or lon coords provided, attempt to figure
                # them out
                if not lat or not lon:
                    svc = LocationService()
                    ret = svc.get_coords(
                        address=street,
                        city=city,
                        zip=postal_code,
                        state_code=state_id,
                        country_code="US"
                    )
                    if ret:
                        lat = ret[0]
                        lon = ret[1]

                print("- model: address.address")
                print("  pk:",i)
                print("  fields:")
                print("    street_number:",num)
                print("    route:",route)
                print("    raw: ",street, sep='')
                print("    formatted: ",street, sep='')
                city_pk = city_pks[tuple([city, postal_code, state_id.title()])]
                print("    locality:", city_pk)
                address_pks[id] = i 
                i = i + 1
                if float(lat) != 0 and float(lon) != 0:
                    print("    latitude:",lat)
                    print("    longitude:",lon)
            except ValueError:
                pass
        return address_pks

    @staticmethod
    def get_city_pks(file_path):
        input_file = csv.DictReader(open(file_path))
        upper = lambda k: lambda d: {**d, k: d[k].upper()}
        res = map(upper('ent-st'), input_file)
        cities = {tuple(d[i].strip().title() for i in ["ent-city", "ent-zip", "ent-st"]) for d in res}
        i=1
        cities_pks = dict()
        country = "United States"
        for city_set in cities:
            city = list(city_set)[0]
            zipcode = list(city_set)[1]
            state_id = list(city_set)[2].upper() if list(city_set)[2] != '' else 'IL'
            if zipcode != '':
                print("- model: address.locality")
                print("  pk:",i)
                print("  fields:")
                print("    name: \"",city,"\"", sep='')
                print("    postal_code: \"",zipcode,"\"", sep='')
                print("    state: ['", state_id, "', '", country, "']", sep='')
                cities_pks[tuple(city_set)] = i 
                i = i + 1
        return cities_pks
 
