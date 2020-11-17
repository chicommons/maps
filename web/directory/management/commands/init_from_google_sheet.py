from gsheets import Sheets
import httplib2
import oauth2client
import re
import requests
import shutil
import urllib.parse
from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):

    def handle(self, *args, **options):

        sheets = Sheets.from_files('/Users/davea/Documents/workspace/chicommons/maps/web/chicommons-ecf14d1c7040.json')
        url = 'https://docs.google.com/spreadsheets/d/1ifpqYM0uV1S3YVPrce5gmvevJ7jc-cFmOk5jDS8Me7U'
        s = sheets.get(url)
        out = s.sheets[3].to_csv('Spam.csv', encoding='utf-8', dialect='excel')
        print(out)
        """
        SCOPES = 'https://www.googleapis.com/auth/drive.readonly'
        SPREADSHEET_ID = '1ifpqYM0uV1S3YVPrce5gmvevJ7jc-cFmOk5jDS8Me7U'

        store = oauth2client.file.Storage('/Users/davea/Documents/workspace/chicommons/maps/web/configuration_g_client.json')
        creds = store.get()
        if not creds or creds.invalid:
            flow = oauth2client.client.flow_from_clientsecrets('client_secret.json', SCOPES)
            creds = oauth2client.tools.run_flow(flow, store)

            service = apiclient.discovery.build('sheets', 'v4', http=creds.authorize(httplib2.Http()))

            result = service.spreadsheets().get(spreadsheetId = SPREADSHEET_ID).execute()
            spreadsheetUrl = result['spreadsheetUrl']
            exportUrl = re.sub("\/edit$", '/export', spreadsheetUrl)
            headers = {
                'Authorization': 'Bearer ' + creds.access_token,
            }
            for sheet in result['sheets']:
                params = {
                    'format': 'csv',
                    'gid': sheet['properties']['sheetId'],
                } 
                queryParams = urllib.parse.urlencode(params)
                url = exportUrl + '?' + queryParams
                response = requests.get(url, headers = headers)
                filePath = '/tmp/foo-%s.csv' % (+ params['gid'])
                with open(filePath, 'wb') as csvFile:
                    csvFile.write(response.content)
        """
