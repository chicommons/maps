import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-enterprise'; // needed for Excel-like "set filter"
// import 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Optional theme CSS
const { REACT_APP_PROXY } = process.env;

export default function SpreadsheetAGGrid(){

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
 
  // Each Column Definition results in one Column.
  const columnDefs= [
    {field: 'id'},
    {field: 'approved', filter: 'agSetColumnFilter'},
    {field: 'name', filter: 'agSetColumnFilter' ,filterParams: {applyMiniFilterWhileTyping: true,}},
    {field: 'formatted_address', filter: 'agSetColumnFilter' },
    {field: 'city', filter:'agSetColumnFilter'},
    {field: 'state', filter:'agSetColumnFilter'},
    {field: 'postal_code', filter:'agSetColumnFilter'},
    {field: 'country_code', filter:'agSetColumnFilter'},
    {field: 'proposed_changes', filter:'agSetColumnFilter'}
  ];
 
  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo( ()=> {
      
      return {
        flex: 1,
        minWidth: 100,
        resizable: true,
        sortable: true
      };
    }, []);
 
  // Example of consuming Grid Event
  const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
  }, []);

  useEffect(() => {
    fetch(REACT_APP_PROXY + "/coops/?limit=10")
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
    
  }, []);


  return (
    <div>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{width: '100%', height: 500}}>
        <AgGridReact 
            ref={gridRef} // Ref for accessing Grid's API
            alwaysShowHorizontalScroll={true}
            alwaysShowVerticalScroll={true}
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
