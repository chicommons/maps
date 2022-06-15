import "ka-table/style.css";

import React, { useState, useEffect, useCallback } from 'react';
import ModalUpdate from "./ModalUpdate";
import {Modal,FormGroup } from 'react-bootstrap'
import Button from './Button'
import { kaReducer, Table } from 'ka-table';
import { loadData, updateData, hideLoading, showLoading, deselectAllRows, selectSingleRow } from "ka-table/actionCreators";
import {
  ActionType,
  DataType,
  EditingMode,
  FilteringMode,
  SortDirection,
  SortingMode,
} from 'ka-table/enums';
import { kaPropsUtils } from "ka-table/utils";
const { REACT_APP_PROXY } = process.env;
const tablePropsInit = {
  columns: [
    // {
    //   key: 'id',
    //   title: 'id',
    //   dataType: DataType.String,
    //   style: { width: 100 }
    // },
    {
      key: 'name',
      title: 'Name',
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      style: { width: 250 }
    },
    {
      key: 'phone',
      title: 'Phone',
      dataType: DataType.String,
      style: { width: 150 }
    },
    {
      key: 'email',
      dataType: DataType.String,
      title: 'Email',
      style: { width: 250 }
    },
    {
      key: 'web_site',
      title: 'Web Site',
      dataType: DataType.String,
      style: { width: 400 }
    },
    {
      key: 'address',
      title: 'Address',
      dataType: DataType.String,
      style: { width: 250 }
    },
    {
      key: 'city',
      title: 'City',
      dataType: DataType.String,
      style: {width:100}
    },
    {
      key: 'state',
      title: 'State',
      dataType: DataType.String,
      style: {width:100}
    },
    {
      key: 'postal_code',
      title: 'Postal Code',
      dataType: DataType.String,
      style: {width:100}
    },
    {
      key: 'country_code',
      title: 'Country',
      dataType: DataType.String,
      style: {width:100}
    },
    {
      key: 'approved',
      title: 'Approved',
      dataType: DataType.Boolean,
      style: {width:100}
    },

    {
      key: 'proposed_change',
      title: 'Proposed Changes',
      dataType: DataType.String,
      style: {width:100}
    },
  ],
  colGroup: { width:400 } ,
  columnResizing: true,
  singleAction: loadData(),
  loading: {
    enabled:true,
    text: 'Loading data'
  },
  sortingMode: SortingMode.Single,
  filteringMode: FilteringMode.HeaderFilter,
  format: ({ column, value }) => {
    if (column.dataType === DataType.Date) {
      return (
        value &&
        value.toLocaleDateString('en', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })
      );
    }
  },
  virtualScrolling: {
    enabled: true
  },
  editingMode: EditingMode.Cell,
  height: 700,
  rowKeyField: 'id',
};


export default function SpreadsheetKaTable(){
  const [dataArray, setDataArray] = useState([])
  const [show, setShow] = useState(false);
  const [option, changeOptions] = useState(tablePropsInit);
  const [tableProps, changeTableProps] = useState(tablePropsInit);
  const [selectedCoop, setSelectedCoop] = useState([])

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // setSelectedCoop(selectedData)
    setShow(true)
  }

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
      setDataArray(mapped)
    })
  }
  const dispatch = async (action) => {
    changeTableProps(prevState => kaReducer(prevState, action));

    if (action.type === ActionType.LoadData) {
      const response = await fetch(REACT_APP_PROXY + "/coops/all/")
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
        dispatch(option.loading?.enabled ? hideLoading() : showLoading())
        return mapped
      })
      const data = response;
      dispatch(updateData(data));
      
    }
  }
  
  const selectedData = kaPropsUtils.getSelectedData(tableProps).pop();

  return (
    <div>
      {selectedData && (<Modal show={show} dialogClassName="modal-90w modal-dialog-scrollable" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalUpdate id={selectedData.id} />
          
          </Modal.Body>
        <Modal.Footer>
          <Button buttonType={"primary"} title={"Cancel"} type={"cancel"}  action={handleClose}>
          
          </Button>
          <Button buttonType={"secondary"} title={"Submit Update"} type={"submit"}  onClick={handleClose}>
            
          </Button>
        </Modal.Footer>
      </Modal>)}
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}

        <Table
          {...tableProps}
          dispatch={dispatch}
          childComponents={{
            dataRow: {
              elementAttributes: () => ({
                onClick: (event, extendedEvent) => {
                  handleShow()
                  
                  // setSelectedCoop(selectedData)
                  
                  extendedEvent.dispatch(
                    selectSingleRow(extendedEvent.childProps.rowKeyValue)
                  );
                  
                  
                }
              })
            }
          }}
        />
        {selectedData && (
          <div className="info">
            <div>
              Selected: {selectedData.name} ({selectedData.id})
              <button
                onClick={() => {
                  dispatch(deselectAllRows());
                }}
              >
                Deselect
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
