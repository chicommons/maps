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
      console.log(
        "working"
      )
    }
  
    const renderSearchResults = () => {
      if (searchResults && searchResults.length) {
        return (
          <>
            <div>Results</div>
            <ListGroup variant="flush">
              {searchResults.map((item) => (
                <ListGroupItem key={item.id} value={item.name}>
                  {item.name}
                  <span className="float-right">
                    <Link to={"/edit/" + item.id + "/home"}>
                      <PencilSquare color="royalblue" size={26} />
                    </Link>
                  </span>
                </ListGroupItem>
              ))}
            </ListGroup>
          </>
        );
      }
    };
  
    return (
      <div className="searchForm">
       

        <input
          type="text"
          placeholder="Name"
          value={searchTerm}
          onChange={handleChange}
        />
  <br />

           
  <Dropdown>
  <Dropdown.Toggle variant="success" id="dropdown-basic">
    Enabled
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Button onClick={()=>handleClick("true")}>True</Button>
    <Button onClick={()=>handleClick("false")}>False</Button>
    <Button onClick={()=>handleClick("true")}>None Selected</Button>
  </Dropdown.Menu>
</Dropdown>

      


    

        <div>
          {renderSearchResults()}
          {loading && (
            <div class="loading">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default AdvancedSearch;