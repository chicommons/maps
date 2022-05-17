import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
// import 'ag-grid-enterprise'; // needed for Excel-like "set filter"
import 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Optional theme CSS
import {Modal,FormGroup } from 'react-bootstrap'
import Button from './Button'
import Input from "../components/Input";
import CancelButton from "./CancelButton";
import ModalUpdate from './ModalUpdate';
const { REACT_APP_PROXY } = process.env;

export default function SpreadsheetAGGrid(){

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [show, setShow] = useState(false);
  const [selectedCoop, setSelectedCoop] = useState([])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Each Column Definition results in one Column.
  const columnDefs= [
    {field: 'id'},
    {field: 'approved', filter: 'agSetColumnFilter'},
    {field: 'name', filter: 'agSetColumnFilter' ,filterParams: {applyMiniFilterWhileTyping: true,}},
    {field: 'phone', filter: 'agSetColumnFilter' ,filterParams: {applyMiniFilterWhileTyping: true,}},
    {field: 'email', filter: 'agSetColumnFilter' ,filterParams: {applyMiniFilterWhileTyping: true,}},
    {field: 'web_site', filter: 'agSetColumnFilter' ,filterParams: {applyMiniFilterWhileTyping: true,}},
    {field: 'address', filter: 'agSetColumnFilter' },
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
        minWidth: 150,
        resizable: true,
        sortable: true
      };
    }, []);
 
  // Example of consuming Grid Event
  const cellClickedListener = useCallback( event => {
    handleShow()
    console.log('cellClicked', event.data);
    setSelectedCoop(event.data)
  }, []);

  const getData = async () => {
    await fetch(REACT_APP_PROXY + "/coops/all/")
    .then((result) => {
      return result.json()})
    .then(data => {
      console.log(data)
      data.forEach((obj)=>Object.keys(obj).forEach(
        (key) => (obj[key] === null) ? obj[key] = '' : obj[key]
      ))
      const mapped = data.map(({ 
        id, 
        approved,
        name, 
        phone, 
        email,
        web_site,
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
      }) => ({ id,approved, name,address:formatted_address,phone:phone.phone, email:email.email, web_site, city, state, postal_code, country_code, proposed_changes}));

      console.log(mapped)
      setRowData(mapped)
    })
  }
  useEffect(() => {
    getData()
  }, []);



  return (
    <div>
 <Modal show={show} dialogClassName="modal-90w modal-dialog-scrollable" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalUpdate id={selectedCoop.id} />
          
          </Modal.Body>
        <Modal.Footer>
          <Button buttonType={"primary"} title={"Cancel"} type={"cancel"}  action={handleClose}>
          
          </Button>
          <Button buttonType={"secondary"} title={"Submit Update"} type={"submit"}  onClick={handleClose}>
            
          </Button>
        </Modal.Footer>
      </Modal>
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
