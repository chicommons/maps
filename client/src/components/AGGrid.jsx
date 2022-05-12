import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
// import 'ag-grid-enterprise'; // needed for Excel-like "set filter"
import 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Optional theme CSS
const { REACT_APP_PROXY } = process.env;

export default function AGGrid(){

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
 
  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {field: 'id'},
    {field: 'name', filter: 'agSetColumnFilter' ,filterParams: {applyMiniFilterWhileTyping: true,}},
    {field: 'formatted_address', filter: 'agSetColumnFilter' },
    {field: 'city', filter:'agSetColumnFilter'},
    {field: 'state', filter:'agSetColumnFilter'},
    {field: 'postal_code', filter:'agNumberColumnFilter'}
  ]);
 
  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo( ()=> {
      
      return {
        flex: 1,
        minWidth: 200,
        resizable: true,
        // filter: 'agSetColumnFilter',
        // filter:true,
        // floatingFilter: true,
        sortable: true
      };
    }, []);
 
  // Example of consuming Grid Event
  const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
  }, []);

  // Example load data from sever

const dummydata = [
  {
  "id": 1,
  "name": "1335 ASTOR CO-OP BUILDING",
  "coopaddresstags_set": [
    {
      "id": 3996,
      "address": {
        "id": 1,
        "street_number": "1335",
        "route": "ST",
        "raw": "1335 N ASTOR ST",
        "formatted": "1335 N ASTOR ST",
        "latitude": 41.9069583,
        "longitude": -87.6271603,
        "locality": {
          "id": 64,
          "name": "Chicago",
          "postal_code": "60610",
          "state": {
            "id": 19313,
            "code": "IL",
            "name": "Illinois",
            "country": {
              "id": 484,
              "name": "United States",
              "code": "US"
            }
          }
        }
      },
      "is_public": true
    }
  ]
},
{
  "id": 2,
  "name": "1530 N STATE PKWY CO-OP",
  "coopaddresstags_set": [
    {
      "id": 3997,
      "address": {
        "id": 2,
        "street_number": "1530",
        "route": "PKWY",
        "raw": "1530 N STATE PKWY",
        "formatted": "1530 N STATE PKWY",
        "latitude": 41.9105834,
        "longitude": -87.6291461,
        "locality": {
          "id": 64,
          "name": "Chicago",
          "postal_code": "60610",
          "state": {
            "id": 19313,
            "code": "IL",
            "name": "Illinois",
            "country": {
              "id": 484,
              "name": "United States",
              "code": "US"
            }
          }
        }
      },
      "is_public": true
    }
  ]
},
{
  "id": 3,
  "name": "1800 South Troy Block Club Garden",
  "coopaddresstags_set": [
    {
      "id": 3998,
      "address": {
        "id": 3,
        "street_number": "1842",
        "route": "St",
        "raw": "1842 S Troy St",
        "formatted": "1842 S Troy St",
        "latitude": 41.85595552,
        "longitude": -87.70425024,
        "locality": {
          "id": 44,
          "name": "Chicago",
          "postal_code": "60623",
          "state": {
            "id": 19313,
            "code": "IL",
            "name": "Illinois",
            "country": {
              "id": 484,
              "name": "United States",
              "code": "US"
            }
          }
        }
      },
      "is_public": true
    }
  ]
},
{
  "id": 4,
  "name": "1871",
  "coopaddresstags_set": [
    {
      "id": 3999,
      "address": {
        "id": 4,
        "street_number": "222",
        "route": "1212",
        "raw": "222 W. Merchandise Mart Plaza, Suite 1212",
        "formatted": "222 W. Merchandise Mart Plaza, Suite 1212",
        "latitude": 41.88802611,
        "longitude": -87.63612199,
        "locality": {
          "id": 26,
          "name": "Chicago",
          "postal_code": "60654",
          "state": {
            "id": 19313,
            "code": "IL",
            "name": "Illinois",
            "country": {
              "id": 484,
              "name": "United States",
              "code": "US"
            }
          }
        }
      },
      "is_public": true
    }
  ]
}
]
  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
    fetch(REACT_APP_PROXY + "/coops/?limit=10")
    .then(result => result.json())
    .then(rowData => {
      const mapped = rowData.map(({ 
        id, 
        name, 
        coopaddresstags_set: [{ 
          address: {
            formatted:formatted_address, 
            locality: {
              name:city, 
              postal_code, 
              state: { name:state }
            }
          }
        }]
      }) => ({ id, name, formatted_address, city, postal_code, state }));
      console.log(mapped)
      setRowData(mapped)
    })
    
  }, []);


  return (
    <div>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{width: '100%', height: 500}}>
        <AgGridReact 
            ref={gridRef} // Ref for accessing Grid's API

            rowData={rowData} // Row Data for Rows
            columnDefs={columnDefs} // Column Defs for Columns
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection='multiple' // Options - allows click selection of rows
            onCellClicked={cellClickedListener} // Optional - registering for Grid Event
            // onGridREady={onGridReady}
            />
      </div>
    </div>
  );
};
