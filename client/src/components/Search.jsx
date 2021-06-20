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
import Province from "./Province.jsx";

import '../containers/FormContainer.css'

import { DEFAULT_COUNTRY_CODE } from "../utils/constants"

const { REACT_APP_PROXY } = process.env;


let abortController = new window.AbortController();

/**
 * Build a search URL in the format
 * /coops/?name=coopName&coop_type=credit+union&enabled=true&street=Main&city=Chicago&zip=60605&state=IL
 */
const buildSearchUrl = (coopSearchSettings, setSearchUrl) => {

	let searchUrl = REACT_APP_PROXY + '/coops/';

	// compile individual search settings into a list
	let individualSearchSettings = []
	if ("name" in coopSearchSettings && coopSearchSettings.name != '') {
			individualSearchSettings.push("name=" + encodeURIComponent(coopSearchSettings.name));
	}
  if ("type" in coopSearchSettings && coopSearchSettings.type != '') {
			individualSearchSettings.push("coop_type=" + encodeURIComponent(coopSearchSettings.type));
	}
  if ("street" in coopSearchSettings && coopSearchSettings.street != '') {
			individualSearchSettings.push("street=" + encodeURIComponent(coopSearchSettings.street));
	}
  if ("city" in coopSearchSettings && coopSearchSettings.city != '') {
			individualSearchSettings.push("city=" + encodeURIComponent(coopSearchSettings.city));
	}
  if ("zip" in coopSearchSettings && coopSearchSettings.zip != '') {
			individualSearchSettings.push("zip=" + encodeURIComponent(coopSearchSettings.zip));
	}
  if ("county" in coopSearchSettings && coopSearchSettings.county != '') {
      individualSearchSettings.push("county=" + encodeURIComponent(coopSearchSettings.county));
  }
  if ("state" in coopSearchSettings && coopSearchSettings.state != '') {
      individualSearchSettings.push("state=" + encodeURIComponent(coopSearchSettings.state));
  }
	if ("enabled" in coopSearchSettings && coopSearchSettings.enabled != "none") {
			individualSearchSettings.push("enabled=" + encodeURIComponent(coopSearchSettings.enabled));
	}

	// assemble all search settings into a string
	let i;
	for (i = 0; i < individualSearchSettings.length; i++) {
		if (i===0) {
			searchUrl = searchUrl + "?" + individualSearchSettings[i];
		} else {
			searchUrl = searchUrl + "&" + individualSearchSettings[i];
		}
	}

	setSearchUrl(searchUrl);

}

const doSearch = (coopSearchSettings, setSearchResults, setLoading, searchUrl) => {
	// abort and fetch logic is very similar to doSearch in Search components
  abortController.abort();
  abortController = new window.AbortController();
  setLoading(true);

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

const Search = (props) => {

	//store evolving search settings before search form is submitted
	const [coopSearchSettings, setCoopSearchSettings] = useState({'state': 'IL'});

	// store finalized search url
	const [searchUrl, setSearchUrl] = useState('');

  const [coopTypes, setCoopTypes] = React.useState([]);
  const [provinces, setProvinces] = React.useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get all possible coop types to populate search form
    fetch(REACT_APP_PROXY + "/coop_types/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const coopTypes = data.map((coopType) => {
          return coopType;
        });
        setCoopTypes(coopTypes.sort((a, b) => (a.name > b.name) ? 1 : -1));
      });
  }
  , []);

  useEffect(() => {
    // Get initial provinces (states)
    fetch(REACT_APP_PROXY + "/states/" + DEFAULT_COUNTRY_CODE)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const initialProvinces = data.map((province) => {
          return province;
        });
        setProvinces(initialProvinces);
      });
  }
  , []);


	useEffect(() => {
		// set searchResults to empty if searchUrl is empty
		if (searchUrl === '') {
	      setSearchResults([]);
	      return;
	    }
		else {
			//Let the debounced function do it's thing
			const results = doSearchDebounced(coopSearchSettings, setSearchResults,
				setLoading, searchUrl);
			setSearchResults(results);
			}
		},
		// Only re-render page if searchUrl has changed.
		// coopSearchSettings is not a dependency because we do want not re-render page
		// every time users type a new character in search form.
		[searchUrl]
	);

	const handleInputChange = (event) => {
		// save user edits to individual form fields to coopSearchSettings
		const { target } = event;
		const { name, value } = target;
		event.persist();
		setCoopSearchSettings({ ...coopSearchSettings, [name]: value });
  };

  const handleFormSubmit = (e) => {
		// when the user finalizes search settings by pressing 'submit,'
		// built out search URL
		e.preventDefault();
    buildSearchUrl(coopSearchSettings, setSearchUrl);
  };

  const formatAddress = obj => {
    const streetAdd = obj.formatted;
    const cityName = obj.locality.name;
    const stateCode = obj.locality.state.code;
    const zip = obj.locality.postal_code;

    return (streetAdd + ', ' + cityName + ', ' + stateCode + ' ' + zip);
  }

	// same logic from Search.jsx
  const renderSearchResults = () => {
    if (searchResults && searchResults.length) {
      return (
          <>
          <div>Results</div>
          <ListGroup variant="flush">
            {searchResults.map((item) => (
              <ListGroupItem key={item.id} value={item.name}>
                <div className="float-left">
                  {item.name}
                  <br />
                  {formatAddress(item.addresses[0])}
                </div>
                <span className="float-right">
                  <Link to={"/directory-additions-updates/" + item.id }>
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
      <FormLabel class='formInputStyle'>Name</FormLabel>
      <FormControl
        class="form-control"
        id={"name"}
        name={"name"}
        value={coopSearchSettings.name}
        placeholder="Enter cooperative name"
        onChange={handleInputChange}
      />{" "}
    </div>
    <div className="form-group">
      <label
      class='formInputStyle'>Coop Type</label>
      <select
        id={"type"}
        name={"type"}
        value={coopSearchSettings.type}
        onChange={handleInputChange}
        className="form-control"
      >
      <option value="" placeholder="Select Coop Type" selected>
      </option>
      {
        coopTypes.map((coopType) =>
        <option key={coopType.id} value={coopType.name}>
          {coopType.name}
        </option>
      )
      }
      </select>
    </div>
    <div className="form-group">
      <FormLabel class='formInputStyle'>Street</FormLabel>
      <FormControl
        class="form-control"
        id={"street"}
        name={"street"}
        value={coopSearchSettings.street}
        placeholder="Enter address street"
        onChange={handleInputChange}
      />{" "}
    </div>
    <div className="form-group">
      <FormLabel class='formInputStyle'>City</FormLabel>
      <FormControl
        class="form-control"
        id={"city"}
        name={"city"}
        value={coopSearchSettings.city}
        placeholder="Enter address city"
        onChange={handleInputChange}
      />{" "}
    </div>
    <div className="form-group">
      <FormLabel class='formInputStyle'>Postal Code</FormLabel>
      <FormControl
        class="form-control"
        id={"zip"}
        name={"zip"}
        value={coopSearchSettings.zip}
        placeholder="Enter postal code"
        onChange={handleInputChange}
      />{" "}
    </div>
    <div className="form-group">
      <FormLabel class='formInputStyle'>County</FormLabel>
      <FormControl
        class="form-control"
        id={"county"}
        name={"county"}
        value={coopSearchSettings.county}
        placeholder="Enter county"
        onChange={handleInputChange}
      />{" "}
    </div>
    <div>
        <Province
            title={"State"}
            className = 'formInputStyle'
            name={"state"}
            options={provinces}
            value={coopSearchSettings.state}
            placseholder={"Select state"}
            handleChange={(e) => setCoopSearchSettings({ ...coopSearchSettings,
              [e.target.name]: e.target.value })}
        />{" "}
    </div>
    <div className="form-group">
      <label class="form-label" class='formInputStyle'>Enabled</label>
      <select
        name={"enabled"}
        value={coopSearchSettings.enabled}
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

export default Search;
