import "ka-table/style.css";


import React, { useState, useEffect } from 'react';
import ModalUpdate from "./ModalUpdate";
import {Modal,FormGroup } from 'react-bootstrap'
import Button from './Button'
import { kaReducer, Table } from 'ka-table';
import { Column } from 'ka-table/models';
import { loadData, updateData, hideLoading, showLoading } from "ka-table/actionCreators";
import {
  ActionType,
  DataType,
  EditingMode,
  FilteringMode,
  SortDirection,
  SortingMode,
} from 'ka-table/enums';

const { REACT_APP_PROXY } = process.env;
const tablePropsInit = {
  columns: [
    {
      key: 'id',
      title: 'ID',
      dataType: DataType.String,
      sortDirection: SortDirection.Descend,
    },
    {
      key: 'name',
      title: 'Name',
      dataType: DataType.String,
      // sortDirection: SortDirection.Descend,
    },
    {
      key: 'approved',
      title: 'Approoved',
      dataType: DataType.Boolean,
    },
    {
      key: 'phone',
      title: 'Phone',
      dataType: DataType.String,
    },
    {
      key: 'email',
      dataType: DataType.String,
      title: 'Email',
    },
    {
      key: 'web_site',
      title: 'Web Site',
      dataType: DataType.String,
    },
    {
      key: 'address',
      title: 'Address',
      dataType: DataType.String,
    },
    {
      key: 'city',
      title: 'City',
      dataType: DataType.String,
    },
    {
      key: 'state',
      title: 'State',
      dataType: DataType.String,
    },
    {
      key: 'postal_code',
      title: 'Postal Code',
      dataType: DataType.String,
    },
    {
      key: 'country_code',
      title: 'Country',
      dataType: DataType.String,
    },
    {
      key: 'proposed_change',
      title: 'Proposed Changes',
      dataType: DataType.String,
    },
  ],
  colGroup: { style: { minWidth: 100 } },
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
  rowKeyField: 'id',
};


export default function SpreadsheetKaTable(){
  const [dataArray, setDataArray] = useState([])
  const [show, setShow] = useState(false);
  const [option, changeOptions] = useState(tablePropsInit);
  const [tableProps, changeTableProps] = useState(tablePropsInit);

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
  const dispatch = async (action) => {
    changeTableProps(prevState => kaReducer(prevState, action));

    if (action.type === ActionType.LoadData) {
      const response = await fetch(REACT_APP_PROXY + "/coops/all/")
      .then((result) => {
        console.log('response')
        console.log(result)
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
        dispatch(option.loading?.enabled ? hideLoading() : showLoading())
        return mapped
      })
    
      
      const data = response;
      console.log(data)
      dispatch(updateData(data));
      
    }
  }

  return (
    <div>
     {/* <Modal show={show} dialogClassName="modal-90w modal-dialog-scrollable" onHide={handleClose}>
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
      </Modal> */}
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}

        <Table
          {...tableProps}
            // data={dataArray}
            dispatch={dispatch}
        />

    </div>
  );
}
