import gspread
import os
import csv
import requests
import io

from oauth2client.service_account import ServiceAccountCredentials

class GoogleSheetService(object):

    def __init__(self, creds_file=os.environ['SERVICE_CREDS_JSON_FILE']):
        scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']

        # add credentials to the account
        creds_file_path = creds_file
        creds = ServiceAccountCredentials.from_json_keyfile_name(creds_file_path, scope)

        self._client = gspread.authorize(creds)


    def download_sheet_as_csv(self, file_name, sheet_num):
        """
        Downloads a specific google sheet corresponding to the file name and sheet number.
        Returns the data as a CSV file.
        """
        sheet = self._client.open(file_name)

        # get the third sheet of the Spreadsheet.  This
        # contains the data we want
        sheet_instance = sheet.get_worksheet(sheet_num)

        url = 'https://docs.google.com/spreadsheets/d/' + sheet.id + '/gviz/tq?tqx=out:csv&gid=' + str(sheet_instance.id)
        headers = {'Authorization': 'Bearer ' + self._client.auth.token}
        res = requests.get(url, headers=headers)

        ar = csv.reader(io.StringIO(res.text, newline=""))
        output = "\n".join([",".join(map(str, ['"' + c.replace('\n', '') + '"' for c in r])) for r in ar])
        return output

    def append_to_sheet(self, file_name, sheet_num, values):
        """
        Adds a row to the end of the given sheet
        """
        sheet = self._client.open(file_name)

        # Write to the endo of the sheet
        sheet_instance = sheet.get_worksheet(sheet_num)
        sheet_instance.append_row(values)

  