#from gsheets import Sheets
#import httplib2
#import oauth2client
#import re
#import requests
#import shutil
#import urllib.parse
#from django.core.management.base import BaseCommand, CommandError
#import requests
#from oauth2client.service_account import ServiceAccountCredentials
#from googleapiclient.discovery import build
#from apiclient import discovery
#import httplib2
#import oauth2client
#import re
#import requests
#import shutil
#import urllib.parse
from django.core.management.base import BaseCommand, CommandError
import gspread
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials
import requests
import sys
import os

class Command(BaseCommand):

    def handle(self, *args, **options):

        #sheets = Sheets.from_files('/Users/davea/Documents/workspace/chicommons/maps/web/credentials.json')
        #url = 'https://docs.google.com/spreadsheets/d/1ifpqYM0uV1S3YVPrce5gmvevJ7jc-cFmOk5jDS8Me7U'
        #credentialFileOfServiceAccount = '/Users/davea/Documents/workspace/chicommons/maps/web/credentials.json'
        #emailOfServiceAccount = 'chicommons-google-sheets@chicommons-1605735260362.iam.gserviceaccount.com'
        #file_id = '1ifpqYM0uV1S3YVPrce5gmvevJ7jc-cFmOk5jDS8Me7U'

        #creds = ServiceAccountCredentials.from_json_keyfile_name(credentialFileOfServiceAccount, scopes='https://www.googleapis.com/auth/drive.readonly')
        
        #access_token = creds.create_delegated(emailOfServiceAccount).get_access_token().access_token

        #url = 'https://www.googleapis.com/drive/v3/files/' + file_id + '/export?gid=974370180&mimeType=text%2Fcsv'
        #url = 'https://docs.google.com/spreadsheets/d/1ifpqYM0uV1S3YVPrce5gmvevJ7jc-cFmOk5jDS8Me7U?output=csv'
        #headers = {'Authorization': 'Bearer ' + access_token}
        #res = requests.get(url, headers=headers)
        #print(res.text)

        #with open('Spam.csv', 'wb') as f:
        #    f.write(res.content)        
              
        scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']

        # add credentials to the account
        creds_file_path = os.environ['SERVICE_CREDS_JSON_FILE']
        creds = ServiceAccountCredentials.from_json_keyfile_name(creds_file_path, scope)

        client = gspread.authorize(creds)
        sheet = client.open('ChiCommons_Directory')

        # get the third sheet of the Spreadsheet.  This
        # contains the data we want
        sheet_instance = sheet.get_worksheet(3)

        records_data = sheet_instance.get_all_records()

        records_df = pd.DataFrame.from_dict(records_data)

        # view the top records
        records_df.to_csv(sys.stdout)  #(r'Spam.csv', index = False)


