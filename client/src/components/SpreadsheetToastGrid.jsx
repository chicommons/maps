import 'tui-grid/dist/tui-grid.css';
import Grid from '@toast-ui/react-grid';
import React, { useState, useEffect, useCallback } from 'react';
const { REACT_APP_PROXY } = process.env;


// const data = [
//   {id: 1, name: 'Editor'},
//   {id: 2, name: 'Grid'},
//   {id: 3, name: 'Chart'}
// ];

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
const columns = [
  {name: 'id', header: 'ID'},
  {name: 'name', header: 'Name'}
];



export default function SpreadsheetToastGrid(){
  const [dataArray, setDataArray] = useState([])
  const columnDefs= [
    // {name: 'id', header: 'ID'},
    // {name: 'approved', header: 'Approved', filter: 'select'},
    {name: 'name', header: 'Name', filter: 'select', sortable: true },
    {name: 'phone', header: 'Phone', filter: 'select',sortable: true},
    {name: 'email', header: 'Email', filter: 'select',sortable: true},
    {name: 'web_site', header: 'Website', filter: 'select',sortable: true},
    {name: 'address', header: 'Address' , filter: 'select',sortable: true},
    {name: 'city', header: 'City' , filter: 'select',sortable: true},
    {name: 'state', header: 'State', filter: 'select',sortable: true },
    {name: 'postal_code', header: 'Postal Code' , filter: 'select',sortable: true},
    {name: 'country_code',header: 'Country' , filter: 'select',sortable: true},
    {name: 'proposed_changes', header: 'Proposed Changes', filter: 'select'}
  ];
  
  
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
  useEffect(() => {
    getData()
  }, []);

  return(
    <Grid
    data={dataArray}
    columns={columnDefs}
    rowHeight={25}
    bodyHeight={100}
    heightResizable={true}
    rowHeaders={['rowNum']}

  />
  )
}

