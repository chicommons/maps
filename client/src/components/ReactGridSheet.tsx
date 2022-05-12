import React, { useState, useEffect }  from "react";
import { ReactGrid, Column, Row, NumberCellTemplate } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
const { REACT_APP_PROXY } = process.env;


interface Coop {
  name: string;
  // surname: string;
  id: number;
  formatted_address:string;
  city: string;
  postal_code: string;
  state: string;
}
const dummyData =  [{
    "id": 2,
    "name": "1530 N STATE PKWY CO-OP",
    "coopaddresstags_set":
     [
      {
        "id": 2,
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
    "id": 91,
    "name": "Black Star Project",
    "coopaddresstags_set": [
      {
        "id": 1687,
        "address": {
          "id": 89,
          "street_number": "3509",
          "route": "Dr",
          "raw": "3509 S King Dr",
          "formatted": "3509 S King Dr",
          "latitude": 41.8301461,
          "longitude": -87.61677666,
          "locality": {
            "id": 81,
            "name": "Chicago",
            "postal_code": "60653",
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
    "id": 94,
    "name": "Blackstone Bicycle Works",
    "coopaddresstags_set": 
    [
      {
        "id": 92,
        "address": {
          "id": 92,
          "street_number": "6100",
          "route": "Ave.",
          "raw": "6100 S. Blackstone Ave.",
          "formatted": "6100 S. Blackstone Ave.",
          "latitude": 41.78388065,
          "longitude": -87.59038586,
          "locality": {
            "id": 84,
            "name": "Chicago",
            "postal_code": "60637",
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

const getColumns = (): Column[] => [
  { columnId: "id", width: 150 },
  { columnId: "name", width: 150 },
  { columnId: "address", width: 150 },
  { columnId: "city", width: 150 },
  { columnId: "state", width: 150 },
  { columnId: "postal_code", width: 150 },
];

const headerRow: Row = {
  rowId: "header",
  cells: [
    { type: "header", text: "ID" },
    { type: "header", text: "Coop Name" },
    { type: "header", text: "Street Address" },
    { type: "header", text: "City" },
    { type: "header", text: "State" },
    { type: "header", text: "Postal Code" },
  ]
};
const getRows = (coops: Coop[]): Row[] => [
  headerRow,
  ...coops.map<Row>((coop, idx) => ({
    rowId: idx,
    cells: [
      { type: "number", value: coop.id },
      { type: "text", text: coop.name },
      { type: "text", text: coop.formatted_address},
      { type: "text", text: coop.city},
      { type: "text", text: coop.state},
      { type: "text", text: coop.postal_code},
    ]
  }))
];
export default function ReactGridSheet(){
  const [coopData, setCoopData] = useState([])
  const mapped = dummyData.map(({ 
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
  const getCoops = (): Coop[] => [...mapped]
  // const getCoops = (): Coop[] => [...coopData]
  
  const [coops] = React.useState<Coop[]>(getCoops());

  const rows = getRows(coops);
  const columns = getColumns();

  useEffect(() => {
    // Get initial coop data
    fetch(REACT_APP_PROXY + "/coops/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCoopData(data.map(({ 
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
        }) => ({ id, name, formatted_address, city, postal_code, state })));
        console.log(data)
        console.log(coopData)
      });
      console.log(mapped)
  }, []);

  return <ReactGrid rows={rows} columns={columns} />;
  // return <Spreadsheet coopData={coopData}/>
}