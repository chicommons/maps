import re
from django.core.management.base import BaseCommand, CommandError
import gspread
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials
import requests
import sys
import os
import csv
import io

class Command(BaseCommand):

    def handle(self, *args, **options):

        scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']

        # add credentials to the account
        creds_file_path = os.environ['SERVICE_CREDS_JSON_FILE']
        creds = ServiceAccountCredentials.from_json_keyfile_name(creds_file_path, scope)

        client = gspread.authorize(creds)
        sheet = client.open('ChiCommons_Directory')

        # get the third sheet of the Spreadsheet.  This
        # contains the data we want
        sheet_instance = sheet.get_worksheet(3)

        url = 'https://docs.google.com/spreadsheets/d/' + sheet.id + '/gviz/tq?tqx=out:csv&gid=' + str(sheet_instance.id)
        headers = {'Authorization': 'Bearer ' + client.auth.token}
        res = requests.get(url, headers=headers)

        ar = csv.reader(io.StringIO(res.text, newline=""))
        output = "\n".join([",".join(map(str, ['"' + c.replace('\n', '') + '"' for c in r])) for r in ar])
        # or, output = "\n".join([",".join(map(str, ['"' + re.sub(r'[\n\r]', '', c) + '"' for c in r])) for r in ar])
        print(output)


