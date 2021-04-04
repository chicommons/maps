import React, { useState, useEffect, useRef } from "react";
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import "../Search.css";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { PencilSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import _ from "lodash";

/* Import Components */
import Input from "../components/Input";
import Button from "../components/Button";

import '../containers/FormContainer.css'

const { REACT_APP_PROXY } = process.env;

let abortController = new window.AbortController();

const initCoopSearchSettings = () => {
	return {
  name: '',
  type: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  enabled: true,
  };
};

const doSearch = (coopSearchSettings, setSearchResults, setLoading) => {
	// logic is very similar to doSearch in Search components
	// except searchUrl is built with multiple parameters from completed form
  abortController.abort();
  abortController = new window.AbortController();
  setLoading(true);

	// build search url
	let searchUrl = REACT_APP_PROXY + '/coops/';

	// compile individual search settings into a list
	let individualSearchSettings = []
	if (coopSearchSettings.name != '') {
		individualSearchSettings.push("name=" + encodeURIComponent(coopSearchSettings.name));
	}
	if (coopSearchSettings.enabled != 'none') {
		individualSearchSettings.push("enabled=" + encodeURIComponent(coopSearchSettings.enabled));
	}

	// assemble all search settings into a string of format
	// /coops/?name=coopName&type=credit+union&enabled=true&street=Main&city=Chicago&zip=60605&state=IL
	let i;
	for (i = 0; i < individualSearchSettings.length; i++) {
		if (i===0) {
			searchUrl = searchUrl + "?" + individualSearchSettings[i];
		} else {
			searchUrl = searchUrl + "&" + individualSearchSettings[i];
		}
	}

  fetch(searchUrl, {
    method: "GET",
    signal: abortController.signal,
  })
    .then((response) => response.json())
    .then((data) => {
      setSearchResults(data);
      setLoading(false);
    })
    .catch((e) => {
      console.log(`Fetch 2 error: ${e.message}`);
    });
};

const doSearchDebounced = _.debounce(doSearch, 100);

const AdvancedSearch = (props) => {

	//store evolving search settings before search form is submitted
	const [coopSearchSettingsStaging, setCoopSearchSettingsStaging] = useState(initCoopSearchSettings() || {});

	//store finalized search settings upon hitting 'submit' button
	const [coopSearchSettingsToQuery, setCoopSearchSettingsToQuery] = useState(initCoopSearchSettings() || {});

	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {

		// set searchResults to empty if coopSearchSettingsToQuery is empty
		if (_.isEqual(coopSearchSettingsToQuery, initCoopSearchSettings()) ) {
	      setSearchResults([]);
	      return;
	    }
		else {
			//Let the debounced function do it's thing
			const results = doSearchDebounced(coopSearchSettingsToQuery, setSearchResults, setLoading);
			setSearchResults(results);
			}
		},
		// Only re-render page if coopSearchSettingsToQuery has changed.
		// coopSearchSettingsStaging is not a dependency because we do want not re-render page
		// every time users type a new character in search form.
		[coopSearchSettingsToQuery]
	);

	const handleInputChange = (event) => {
		// save user edits to individual form fields to coopSearchSettingsStaging
		const { target } = event;
		const { name, value } = target;
		event.persist();
		setCoopSearchSettingsStaging({ ...coopSearchSettingsStaging, [name]: value });
  };

  const handleFormSubmit = (e) => {
		// when the user finalizes search settings by pressing 'submit,'
		// move search settings from staging to coopSearchSettingsToQuery
		e.preventDefault();
		setCoopSearchSettingsToQuery(coopSearchSettingsStaging);
  };

	// same logic from Search.jsx
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
    <div className="form container-fluid">
		{/* FormGroup logic from FormContainer.jsx */}
    <FormGroup controlId="formBasicText">
		{/* FormLabel and FormControl logic from Input.jsx */}
    <div className="form-group">
      <FormLabel style={inputStyle}>Name</FormLabel>
      <FormControl
        class="form-control"
        id={"name"}
        name={"name"}
        value={coopSearchSettingsStaging.name}
        placeholder="Enter cooperative name"
        onChange={handleInputChange}
      />{" "}
    </div>
    <div className="form-group">
      <label class="form-label" style={inputStyle}>Enabled</label>
      <select
        name={"enabled"}
        value={coopSearchSettingsStaging.enabled}
        onChange={handleInputChange}
        className="form-control"
      >
        <option selected value="none">None Selected</option>
        <option value="true">True</option>
        <option value="False">False</option>
      </select>
    </div>
      <Button
        action={handleFormSubmit}
        type={"primary"}
        title={"Submit"}
        style={buttonStyle}
      />{" "}
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
    </FormGroup>
    </div>
  );
};

const buttonStyle = {
  margin: "10px 10px 10px 10px",
  color: "#F6FBFB",
  backgroundColor: "#2295A2"
};
const inputStyle = {
  color: "#124E54"
  }

export default AdvancedSearch;
