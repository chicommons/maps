import 'tui-grid/dist/tui-grid.css';
import Grid from '@toast-ui/react-grid';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import ModalUpdate from './ModalUpdate';
const { REACT_APP_PROXY } = process.env;

export default function Spreadsheet(props){
  const [dataArray, setDataArray] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedCoop, setSelectedCoop] = useState([]);
  const handleClose = () => {
    setShow(false);
    setSelectedCoop([]);
  }
  const handleShow = () => setShow(true);
  const [allquery, setAllquery] = useState({})

  const columnDefs= [
    {name: 'id', header: 'ID', filter: 'select', sortable: true, resizable:true, width:70},
    {name: 'name', header: 'Name', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'phone', header: 'Phone', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'email', header: 'Email', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'web_site', header: 'Website', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'street_number', header: 'Street Number', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'route', header: 'Route', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'raw', header: 'Raw', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'address', header: 'Address', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'latitude', header: 'Latitude', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'longitude', header: 'Longitude', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'locality_id', header: 'Locality Id', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'city', header: 'City', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'state_id', header: 'State Id', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'state_code', header: 'State Code', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'state', header: 'State', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'postal_code', header: 'Zip Code', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'country_id',header: 'Country Id', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'country',header: 'Country', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'country_code',header: 'Country Code', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'entity_types',header: 'Entity Type', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'country_code',header: 'Country Code', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'is_public',header: 'Is Public?', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'approved',header: 'Approved?', filter: 'select', sortable: true, resizable:true,width:120},
  ];
  
  const gridRef = useRef(null)
  
  const renderAllCoops = async () => {
    await fetch(REACT_APP_PROXY + "/coops/all/")
    .then((result) => {
      return result.json()})
    .then(data => renderSearchData(data))
  }

  const renderSearchData = (data) => {
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
      types:[{
        name:entity_types,
      }],
      coopaddresstags_set: [{ 
        address: {
          id:address_id,
          street_number,
          route,
          raw,
          formatted:formatted_address, 
          latitude,
          longitude,
          locality: {
            id:locality_id,
            name:city, 
            postal_code, 
            state: { 
              id:state_id,
              code:state_code, 
              name:state, 
              country:{
                id:country_id,
                name:country,
                code:country_code
              } 
            }
          }
        },
        is_public,
      }]
    }) => ({ 
      id,
      approved, 
      name,
      street_number,
      route,
      raw,
      address:formatted_address,
      latitude,
      longitude,
      phone:phone.phone, 
      email:email.email, 
      web_site,
      locality_id,
      city,
      state_id,
      state_code, 
      state, 
      postal_code,
      country_id,
      country, 
      country_code,
      is_public,
      entity_types
    }));
    setDataArray(mapped);
  }

  const cellClickedListener = useCallback( event => {
    handleShow();
    setSelectedCoop(gridRef.current.getInstance().getRow(event.rowKey));
  }, []);

  useEffect(() => {
    if(props.searchResults){
      renderSearchData(props.searchResults)
    } else {
      renderAllCoops()
    }
  }, []);

  return(
    <div>
      <Modal show={show} dialogClassName="modal-90w modal-dialog-scrollable" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalUpdate id={selectedCoop.id} handleClose={handleClose}/>
          </Modal.Body>
      </Modal>
      <Grid
        ref={gridRef}
        data={dataArray}
        columns={columnDefs}
        rowHeight={25}
        bodyHeight={500}
        heightResizable={true}
        scrollX={true}
        scrollY={true}
        usageStatistics={false}
        onDblclick={cellClickedListener}
      />
    </div>

  )
}