import React, { useState, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css'
const { REACT_APP_PROXY } = process.env;
// register Handsontable's modules
registerAllModules();

// const hotData = createSpreadsheetData(6, 10);

// [
//   ["", "Tesla", "Volvo", "Toyota", "Honda"],
//   ["2020", 10, 11, 12, 13],
//   ["2021", 20, 11, 14, 13],
//   ["2022", 30, 15, 12, 13]
// ];

export default function SpreadsheetHandsontable() {

  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const columnHeaders = ['ID', 'Approved?', 'Name', 'Address', 'City', 'State', 'Zip', 'Country', 'Proposed Changes']

  const logChange =(changes)=>{
    if (changes){
      const id = changes[0][0]
      console.log(rowData[id])
    }
  }

  const getData = async () => {
    await fetch(REACT_APP_PROXY + "/coops/?limit=10")
    .then(result => result.json())
    .then(rowData => {
      const mapped = rowData.map(({ 
        id, 
        approved,
        name, 
        coopaddresstags_set: [{ 
          address: {
            formatted:formatted_address, 
            locality: {
              name:city, 
              postal_code, 
              state: { name:state, country:{code:country_code} }
            }
          },
          proposed_changes
        }]
      }) => ({ id,approved, name, formatted_address, city, state, postal_code, country_code, proposed_changes}));
      setRowData(mapped)
    })
  }
  useEffect(() => {
    getData()
  }, []);
 

  return (
    <div id="hot-app">
      <HotTable
        data={rowData}
        colHeaders={columnHeaders}
        columnSorting={true}
        filters={true}
        dropdownMenu={true}
        width="auto"
        height="500"
        manualColumnResize={true}
        licenseKey='non-commercial-and-evaluation'
        afterChange={logChange}
      />
    </div>
  );
}
