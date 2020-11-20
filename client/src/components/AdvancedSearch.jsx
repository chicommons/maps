import React, { useState, useEffect } from "react";
import "../Search.css";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { PencilSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import _ from "lodash";

const AdvancedSearch = (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }
  
      // Let the debounced function do it's thing
      const results = doSearchDebounced(searchTerm, setSearchResults, setLoading);
      setSearchResults(results);
    }, [searchTerm]);
  
    const handleChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
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
  
    const debouncedHandleChange = _.debounce(handleChange, 100);
    return (
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
        />
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