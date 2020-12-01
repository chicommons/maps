import React, { useState, useEffect } from "react";
import "../Search.css";
import ListGroup from "react-bootstrap/ListGroup";
import {ListGroupItem, Button, ButtonGroup, ToggleButton, ToggleButtonGroup, Dropdown} from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import _ from "lodash";


const AdvancedSearch = (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [enabled, setEnabled] = useState("none")
  

    const radios = [
      { name: 'Active', value: '1' },
      { name: 'Radio', value: '2' },
      { name: 'Radio', value: '3' },
    ];
  
  
    useEffect(() => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }
  
      // Let the debounced function do it's thing
      const results = searchResults;
      setSearchResults(results);
    }, [searchTerm]);
  
    const handleChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleClick = (enabled) => {
      setEnabled(enabled)
    }
    const handleSubmit = () =>{

    }
  
    return (
      <div className="searchForm">
        <input
          type="text"
          placeholder="Name"
          value={searchTerm}
          onChange={handleChange}
        />
        <br />

       <br></br>   
      <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic" style={style}>
                 Enabled
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Button onClick={()=>handleClick("true")} style={style}>True</Button>
            <Button onClick={()=>handleClick("false")} style={style}>False</Button>
            <Button onClick={()=>handleClick("none")} style={style}>None Selected</Button>
          </Dropdown.Menu>
      </Dropdown>
    <br></br>
    <Button onClick={()=>handleSubmit()} style={style}>Submit</Button>
  <div>
 </div>
      </div>
    );
  };

  const style = {
    color: "#F6FBFB", 
    backgroundColor: "#2295A2"
  };
  
  export default AdvancedSearch;

