import 'tui-grid/dist/tui-grid.css';
import Grid from '@toast-ui/react-grid';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {Modal,FormGroup } from 'react-bootstrap'
import Button from './Button'
import Input from "../components/Input";
import CancelButton from "./CancelButton";
import ModalUpdate from './ModalUpdate';
const { REACT_APP_PROXY } = process.env;
/*
const olddata =[
  {
    "id": 1,
    "approved": true,
    "name": "1335 ASTOR CO-OP BUILDING",
    "address": "1335 N ASTOR ST",
    "phone": "+13129437500",
    "web_site": "https://www.dkcondo.com/managed-associations/1335-astor-co-op/",
    "city": "Chicago",
    "state": "Illinois",
    "postal_code": "60610",
    "country_code": "US"
  },
  {
    "id": 2,
    "approved": true,
    "name": "1530 N STATE PKWY CO-OP",
    "address": "1530 N STATE PKWY",
    "phone": "312.944.8945,312.751.0900",
    "web_site": "https://mce.uwcc.wisc.edu/Cooperatives_map/",
    "city": "Chicago",
    "state": "Illinois",
    "postal_code": "60610",
    "country_code": "US"
  },
  {
    "id": 3,
    "approved": true,
    "name": "1800 South Troy Block Club Garden",
    "address": "1842 S Troy St",
    "web_site": "http://neighbor-space.org/2012/04/21/1800-south-troy-block-club-garden/",
    "city": "Chicago",
    "state": "Illinois",
    "postal_code": "60623",
    "country_code": "US"
  }
  
]
*/
const columns = [
  {name: 'id', header: 'ID'},
  {name: 'name', header: 'Name'}
];



export default function SpreadsheetToastGrid(){
  const [dataArray, setDataArray] = useState([])
  const [show, setShow] = useState(false);
  const [selectedCoop, setSelectedCoop] = useState([])
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const columnDefs= [
    // {name: 'id', header: 'ID'},
    // {name: 'approved', header: 'Approved', filter: 'select'},
    {name: 'name', header: 'Name', filter: 'select', sortable: true, resizable:true},
    {name: 'phone', header: 'Phone', filter: 'select', sortable: true, resizable:true},
    {name: 'email', header: 'Email', filter: 'select', sortable: true, resizable:true},
    {name: 'web_site', header: 'Website', filter: 'select', sortable: true, resizable:true},
    {name: 'address', header: 'Address', filter: 'select', sortable: true, resizable:true},
    {name: 'city', header: 'City', filter: 'select', sortable: true, resizable:true},
    {name: 'state', header: 'State', filter: 'select', sortable: true, resizable:true},
    {name: 'postal_code', header: 'Zip Code', filter: 'select', sortable: true, resizable:true},
    {name: 'country_code',header: 'Country', filter: 'select', sortable: true, resizable:true},
    {name: 'proposed_changes', header: 'Proposed Changes', filter: 'select', resizable:true},
  ];
  
  const gridRef = useRef(null)
  
  const getData = async () => {
    await fetch(REACT_APP_PROXY + "/coops/all/")
    .then((result) => {
      return result.json()})
    .then(data => {
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
      setDataArray(mapped)
    })
  }

  const cellClickedListener = useCallback( event => {
    handleShow()
    console.log('cellClicked', gridRef.current.getInstance().getRow(event.rowKey))
  
    setSelectedCoop(gridRef.current.getInstance().getRow(event.rowKey))
    console.log(event);
    // setSelectedCoop(event.data)
  }, []);

  useEffect(() => {
    getData()
  }, []);

  return(
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
      <Grid
      ref={gridRef}
      data={dataArray}
      columns={columnDefs}
      rowHeight={25}
      bodyHeight={500}
      heightResizable={true}
      rowHeaders={['checkbox']}
      scrollX={true}
      scrollY={true}
      usageStatistics={false}
      onDblclick={cellClickedListener}
    />
    </div>

  )
}