import React, { useState, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
const { REACT_APP_PROXY } = process.env;
// register Handsontable's modules
registerAllModules();

export default function SpreadsheetHandsontable() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const columnHeaders = ['ID', 'Approved?', 'Name','Address', 'City', 'State', 'Zip', 'Country', 'Proposed Changes']

  const logChange =(changes)=>{
    if (changes){
      const id = changes[0][0]
      console.log(rowData[id])
    }
  }

  const getData = async () => {
    await fetch(REACT_APP_PROXY + "/coops/")
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
      }) => ({ id,approved, name,formatted_address, city, state, postal_code, country_code, proposed_changes}));
      setRowData(mapped)
    })
  }
  useEffect(() => {
    getData()
  }, []);

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
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
    </div>

  );
}
