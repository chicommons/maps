import React, { useState, useEffect }  from "react";
import { ReactGrid, Column, Row, NumberCellTemplate } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

// interface Person {
//   name: string;
//   id: number;
//   formatted_address:string;
//   city: string;
//   postal_code: string;
//   state: string;
// }
// // interface Props {
// //   props:any
// // }
// const getColumns = (): Column[] => [
//   { columnId: "id", width: 150 },
//   { columnId: "name", width: 150 },
//   { columnId: "address", width: 150 },
//   { columnId: "city", width: 150 },
//   { columnId: "state", width: 150 },
//   { columnId: "postal_code", width: 150 },
// ];

// const headerRow: Row = {
//   rowId: "header",
//   cells: [
//     { type: "header", text: "ID" },
//     { type: "header", text: "Coop Name" },
//     { type: "header", text: "Street Address" },
//     { type: "header", text: "City" },
//     { type: "header", text: "State" },
//     { type: "header", text: "Postal Code" },
//   ]
// };
// const getRows = (people: Person[]): Row[] => [
//   headerRow,
//   ...people.map<Row>((person, idx) => ({
//     rowId: idx,
//     cells: [
//       { type: "number", value: person.id },
//       { type: "text", text: person.name },
//       { type: "text", text: person.formatted_address},
//       { type: "text", text: person.city},
//       { type: "text", text: person.state},
//       { type: "text", text: person.postal_code},
//     ]
//   }))
// ];

const Spreadsheet = ()=>{
//   // const [coopData, setCoopData] = useState([])
//   // const {coopData} = props.coopData
 


//   const mapped = props.coopData.map(({ 
//     id, 
//     name, 
//     coopaddresstags_set: [{ 
//       address: {
//         formatted:formatted_address, 
//         locality: {
//           name:city, 
//           postal_code, 
//           state: { name:state }
//         }
//       }
//     }]
//   }) => ({ id, name, formatted_address, city, postal_code, state }));
  
//   const getPeople = (): Person[] => [
//     // use typescript destructuring to access keyes
//   ...mapped
//   ]


//   const [people] = React.useState<Person[]>(getPeople());
//   const rows = getRows(people);
//   const columns = getColumns();
//   useEffect(() => {
//     // Get initial coop data
//     // setCoopData(props.coopData);
//     console.log(props.coopData)
//     // console.log(coopData)
//   }, []);

//   return <ReactGrid rows={rows} columns={columns} />
}


// export default Spreadsheet;