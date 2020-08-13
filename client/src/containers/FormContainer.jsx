import React, { useEffect, useState } from "react";
import { FormGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import _ from "lodash";

/* Import Components */
import CoopService from "../services/CoopService";
import Input from "../components/Input";
import CoopTypes from "../components/CoopTypes";
import Country from "../components/Country";
import Province from "../components/Province";
import Button from "../components/Button";
import { DEFAULT_COUNTRY_CODE } from "../utils/constants";
import { useAlert } from "../components/AlertProvider";

const { REACT_APP_PROXY } = process.env;

const FormContainer = (props) => {
  const [countries, setCountries] = React.useState([]);
  const [provinces, setProvinces] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  const [coopTypes, setCoopTypes] = React.useState([]);
  const [coop, setCoop] = React.useState(props.coop);
  const history = useHistory();
  const [open, close] = useAlert();
  console.log("coop:");
  console.log(coop);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    CoopService.save(coop, setErrors, function(data) {
      const result = data;
      history.push({
        pathname: "/" + result.id + "/people",
        state: { coop: result, message: "Success" },
      });
      window.scrollTo(0, 0);
    });
  };

  const handleClearForm = () => {
    // Logic for resetting the form
  };

  const handleCoopTypeAddition = (tag) => {
    const coopCopy = JSON.parse(JSON.stringify(coop));
    const types = coopCopy.types;
    types[types.length] = { name: tag.text };
    setCoop(coopCopy);
  };

  const handleCoopTypeDeletion = (i) => {
    const coopCopy = JSON.parse(JSON.stringify(coop));
    let types = coopCopy.types;
    types = types.filter((type, index) => index !== i);
    coopCopy.types = types;
    setCoop(coopCopy);
  };

  const handleInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    if (name.indexOf("[") === -1) {
      setValue(name, value);
    } else {
      const coopCopy = JSON.parse(JSON.stringify(coop));
      const keys = name.split(/[\[\].]+/);
      console.log("setting " + name + " to " + value);
      _.set(coopCopy, name, value);
      setCoop(coopCopy);
    }
  };

  const handleProvinceChange = (e) => {
    const coopCopy = JSON.parse(JSON.stringify(coop));
    const name = e.target.name.replace("\.name", ".code");
    const value = e.target.value; 
    console.log("setting " + name + " to " + value);
    _.set(coopCopy, name, value);
    const stateElt = document.getElementById(e.target.name);
    const stateText = stateElt.options[stateElt.selectedIndex].text;
    const coopStateName = e.target.name;
    _.set(coopCopy, coopStateName, stateText);
    
    // Update the parent country
    const countryName = e.target.name.replace("\.name", ".country.code");
    console.log("country name:" + countryName);
    const countryElt = document.getElementById(countryName);
    const countryNameText = countryElt.options[countryElt.selectedIndex].text; 
    const coopCountryAttrName = e.target.name.replace("\.name", ".country.name");
    _.set(coopCopy, coopCountryAttrName, countryNameText);
    setCoop(coopCopy);
  };


  const updateValue = (name, value, index = 0) => {
    const coopCopy = JSON.parse(JSON.stringify(coop));
    if (name.length - 1 > index) {
      const isArray = Array.isArray(coop[name[index]]);
      if (isArray) {
        console.log("name:" + name);
        console.log("name index: " + name[index]);
      } else {
        console.log("other branch");
        console.log("name:" + name);
        console.log("name index: " + name[index]);
      }
    } else {
      console.log("name:" + name + " index:" + index);
      _.set(coopCopy, [name[index]], value);
      console.log("set coop copy to ...");
      console.log(coopCopy);
      //setCoop( coopCopy );
      //obj = { ...obj, [name[index]]: value };
    }
    return coopCopy;
  };

  /**
   * Verify phone field conforms to US phone (10 digits)
   *
   * @param  e
   */
  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/, "");
    value = value.length > 10 ? value.substring(0, 10) : value;
    let name = e.target.name;
    //update phone
    setValue(name, value);
  };

  const setValue = (is, value) => {
    const coopCopy = JSON.parse(JSON.stringify(coop));
    if (typeof is == "string") {
      console.log("setting string value");
      _.set(coopCopy, is, value);
      return setCoop(coopCopy);
    } else if (is.length === 1 && value !== undefined) {
      _.set(coopCopy, is, value);
      console.log(coopCopy);
      return setCoop(coopCopy);
    } else if (is.length === 0) return coop;
    else {
      console.log("is:" + is + " value:" + value);
      return setValue(is.slice(1), value);
    }
  };

  useEffect(() => {
    // Get initial countries
    fetch(REACT_APP_PROXY + "/countries/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const initialCountries = data.map((country) => {
          return country;
        });
        setCountries(initialCountries);
      });

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

    // Get all possible coop types
    fetch(REACT_APP_PROXY + "/coop_types/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const coopTypes = data.map((coopType) => {
          return coopType;
        });
        setCoopTypes(coopTypes);
      });
  }, []);

  useEffect(() => {
    const coop = props.coop;
    setCoop(coop);
  }, [props]);

  /* This life cycle hook gets executed when the component mounts */

  if (coopTypes && !coopTypes.length) {
    return null;
  }
  return (
    <div>
      <form className="container-fluid" onSubmit={handleFormSubmit}>
        <FormGroup controlId="formBasicText">
          <Input
            inputType={"text"}
            title={"Name"}
            name={"name"}
            value={coop.name}
            placeholder={"Enter cooperative name"}
            handleChange={handleInput}
            errors={errors}
          />{" "}
          {/* Name of the cooperative */}
          <CoopTypes
            name={"types"}
            suggestions={coopTypes}
            values={coop.types}
            placeholder={"Enter coop type(s)"}
            handleAddition={handleCoopTypeAddition}
            handleDeletion={handleCoopTypeDeletion}
            errors={errors}
          />{" "}
          {/* Coop Type Selection */}
          <Input
            inputType={"text"}
            title={"Street"}
            name={"addresses[0].formatted"}
            value={coop.addresses[0].formatted}
            placeholder={"Enter address street"}
            handleChange={handleInput}
            errors={errors}
          />{" "}
          {/* Address street of the cooperative */}
          <Input
            inputType={"text"}
            title={"City"}
            name={"addresses[0].locality.name"}
            value={coop.addresses[0].locality.name}
            placeholder={"Enter address city"}
            handleChange={handleInput}
            errors={errors}
          />{" "}
          {/* Address city of the cooperative */}
          <Country
            title={"Country"}
            name={"addresses[0].locality.state.country.code"}
            options={countries}
            countryCode={coop.addresses[0].locality.state.country.code}
            placeholder={"Select Country"}
            handleChange={handleInput}
          />{" "}
          {/* Country Selection */}
          <Province
            title={"State"}
            name={"addresses[0].locality.state.name"}
            options={provinces}
            value={coop.addresses[0].locality.state.code}
            placeholder={"Select State"}
            handleChange={handleProvinceChange}
          />{" "}
          {/* State Selection */}
          <Input
            inputType={"text"}
            title={"Postal Code"}
            name={"addresses[0].locality.postal_code"}
            value={coop.addresses[0].locality.postal_code}
            placeholder={"Enter postal code"}
            handleChange={handleInput}
            errors={errors}
          />{" "}
          {/* Address postal code of the cooperative */}
          {coop.addresses[0]?.latitude && coop.addresses[0]?.longitude && ( 
          <div>Lat: {coop.addresses[0]?.latitude.toFixed(3)} Lon: {coop.addresses[0]?.longitude.toFixed(3)}</div>
          )}
          <Input
            inputType={"text"}
            title={"Email"}
            name={"email.email"}
            value={coop.email?.email}
            placeholder={"Enter email"}
            handleChange={handleInput}
            errors={errors}
          />{" "}
          {/* Email of the cooperative */}
          <Input
            inputType={"text"}
            title={"Phone"}
            name={"phone.phone"}
            value={coop.phone?.phone}
            placeholder={"Enter phone number"}
            handleChange={handlePhoneInput}
            errors={errors}
          />{" "}
          {/* Phone number of the cooperative */}
          <Input
            inputType={"text"}
            title={"Web Site"}
            name={"web_site"}
            value={coop.web_site}
            placeholder={"Enter web site"}
            handleChange={handleInput}
            errors={errors}
          />{" "}
          {/* Web site of the cooperative */}
          <Button
            action={handleFormSubmit}
            type={"primary"}
            title={"Submit"}
            style={buttonStyle}
          />{" "}
          {/*Submit */}
          <Button
            action={handleClearForm}
            type={"secondary"}
            title={"Clear"}
            style={buttonStyle}
          />{" "}
          {/* Clear the form */}
        </FormGroup>
      </form>
    </div>
  );
};

const buttonStyle = {
  margin: "10px 10px 10px 10px",
};

export default FormContainer;
