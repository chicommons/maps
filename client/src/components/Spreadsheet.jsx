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

  const columnDefs = [
    {name: 'id', header: 'ID', filter: 'select', sortable: true, resizable:true, width:70},
    {name: 'name', header: 'Name', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'phone', header: 'Phone', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'phone_is_public', header: 'Phone is Public', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'email', header: 'Email', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'email_is_public', header: 'Email is Public', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'web_site', header: 'Website', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'address', header: 'Address', filter: 'select', sortable: true, resizable:true, width:200},
    {name: 'latitude', header: 'Latitude', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'longitude', header: 'Longitude', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'city', header: 'City', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'state_id', header: 'State Id', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'state', header: 'State', filter: 'select', sortable: true, resizable:true, width:100},
    {name: 'postal_code', header: 'Zip Code', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'country',header: 'Country', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'entity_types',header: 'Entity Type', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'country_code',header: 'Country Code', filter: 'select', sortable: true, resizable:true,width:100},
    {name: 'address_public',header: 'Address is Public?', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'approved',header: 'Approved?', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'description',header: 'Entity Description', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'reject_reason',header: 'Reject reason', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'status',header: 'Status', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'scope',header: 'Geographic Scope', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'tags',header: 'Tags', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'rec_source',header: 'Record source', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'rec_updated_date',header: 'Record updated date"', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'rec_updated_by',header: 'Record updated by', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'contact_first',header: 'Contact First Name', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'contact_last',header: 'Contact Last Name', filter: 'select', sortable: true, resizable:true,width:120},
    {name: 'contact_public',header: 'Contact Public?', filter: 'select', sortable: true, resizable:true,width:120},
  ];
  
  const gridRef = useRef(null)
  
  const renderAllCoops = async () => {
    try {
      await fetch(REACT_APP_PROXY + "/coops/all/")
      .then((result) => {
        return result.json()})
      .then(data => renderSearchData(data))
    } catch (error) {
      console.error(error)
    }
  }

  const renderSearchData = (data) => {
    data.forEach((obj)=>Object.keys(obj).forEach(
      (key) => (obj[key] === null) ? obj[key] = '' : obj[key]
    ))
    const mapped = data.map(
      (
        {
          id, 
          approved,
          name, 
          phone: [ phone = {}],
          email: [ email = {}],
          web_site,
          types:[{
            name:entity_types,
          }],
          coopaddresstags_set: [
            { 
              address: {
                id:address_id,
                formatted:formatted_address, 
                latitude,
                longitude,
                locality: {
                  name:city, 
                  postal_code, 
                  state: { 
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
              is_public: address_public,
              description,
              reject_reason,
              scope,
              tags,
              rec_source,
              rec_updated_by,
              rec_updated_date,
            }
          ],
          people: [ people = {}]
        }
    ) => (
      { 
        id,
        approved, 
        name,
        address:formatted_address,
        latitude,
        longitude,
        phone: phone.phone,
        phone_is_public:phone.phone_is_public, 
        email:email.email,
        email_is_public:email.email_is_public,
        web_site,
        city,
        state_code, 
        state, 
        postal_code,
        country_id,
        country, 
        country_code,
        address_public,
        entity_types,
        description,
        reject_reason,
        scope,
        tags,
        rec_source,
        rec_updated_by,
        rec_updated_date,
        contact_first: people.first_name,
        contact_last: people.last_name,
        contact_public: people.is_public,

      }
    )
  );
  setDataArray(mapped);
  }

  const cellClickedListener = useCallback( event => {
    handleShow();
    setSelectedCoop(gridRef.current.getInstance().getRow(event.rowKey));
  }, []);

  useEffect(() => {
    if(props.searchResults){
      renderSearchData(props.searchResults)
      console.log(props.searchResults)
    } else {
      renderAllCoops()
    }
  }, []);

  const treeColumnOptions = {
    // name: ['phone', 'email'],
    name: 'phone',
    useIcon: true,
  }

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