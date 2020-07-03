import React, { Component } from "react";
import { FormGroup } from "react-bootstrap";

/* Import Components */
import Input from "../components/Input";
import CoopTypes from "../components/CoopTypes";
import Country from "../components/Country";
import Province from "../components/Province";
import Button from "../components/Button";

const initNewCoop = () => {
  return {
        name: "",
        types: [],
        addresses: [
          {
            formatted: "",
            locality: {
              name: "",
              postal_code: "",
              state: "",
            },
            country: {
              code: FormContainer.DEFAULT_COUNTRY_CODE,
            },
          }
        ],
        enabled: true,
        email: {
          email: ""
        },
        phone: {
          phone: ""
        },
        web_site: "",
      }
}

class FormContainer extends Component {
  static DEFAULT_COUNTRY_CODE = "US";
  static REACT_APP_PROXY = process.env.REACT_APP_PROXY;

  constructor(props) {
    super(props);

    this.state = {
      countries: [],
      provinces: [],
      errors: [],
      newCoop: initNewCoop(),
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handlePhoneInput = this.handlePhoneInput.bind(this);
    this.handleCoopTypeAddition = this.handleCoopTypeAddition.bind(this);
    this.handleCoopTypeDeletion = this.handleCoopTypeDeletion.bind(this);
  }

  /* This life cycle hook gets executed when the component mounts */

  async handleFormSubmit(e) {
    e.preventDefault();
    // Make a copy of the object in order to remove unneeded properties
    const NC = JSON.parse(JSON.stringify(this.state.newCoop)) 
    delete NC.addresses[0].country;

    try {
      const response = await fetch(FormContainer.REACT_APP_PROXY + "/coops/", {
        method: "POST",
        body: JSON.stringify(NC),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        window.scrollTo(0, 0);
        window.flash("Record has been created successfully!", "success");
        this.handleClearForm();
        // reset state
        this.setState({newCoop: initNewCoop()});
        return result;
      }
      throw await response.json();
    } catch (errors) {
      console.log("_error_: ", errors);
      this.setState({ errors });
    }
  }

  handleClearForm() {
    // Logic for resetting the form
  }

  handleCoopTypeAddition(tag) {
    console.log("adding ..." + tag);
    const types = this.state.newCoop.types;
    types[types.length] = { name: tag.text };
    this.setState({
      newCoop: { ...this.state.newCoop, types: types },
    });
  }

  handleCoopTypeDeletion(i) {
    const types = this.state.newCoop.types;
    console.log("removing " + i);
    console.log(types.filter((type, index) => index !== i));
    this.setState({
      newCoop: {
        ...this.state.newCoop,
        types: types.filter((type, index) => index !== i),
      },
    });
  }

  handleInput(e) {
    let self = this;
    let value = e.target.value;
    let name = e.target.name;
    if (name.indexOf("[") === -1) {
      this.setValue(self.state.newCoop, name, value);
    } else {
      const keys = name.split(/[\[\].]+/);
      this.setState(this.updateValue(this.state, keys, value));
    }
  }

  updateValue = (obj, name, value, index = 0) => {
    if (name.length - 1 > index) {
      const isArray = Array.isArray(obj[name[index]]);
      obj[name[index]] = this.updateValue(
        isArray ? [...obj[name[index]]] : { ...obj[name[index]] },
        name,
        value,
        index + 1
      );
    } else {
      obj = { ...obj, [name[index]]: value };
    }
    return obj;
  };

  /**
   * Verify phone field conforms to US phone (10 digits)
   *
   * @param  e
   */
  handlePhoneInput(e) {
    let self = this;
    let value = e.target.value.replace(/\D/, "");
    value = value.length > 10 ? value.substring(0, 10) : value;
    let name = e.target.name;
    //update phone
    this.setValue(self.state.newCoop, name, value);
  }

  setValue = (obj, is, value) => {
    if (typeof is == "string") return this.setValue(obj, is.split("."), value);
    else if (is.length === 1 && value !== undefined) {
      return this.setState({ obj: (obj[is[0]] = value) });
    } else if (is.length === 0) return obj;
    else return this.setValue(obj[is[0]], is.slice(1), value);
  };

  render() {
    if (this.state.coopTypes && !this.state.coopTypes.length) {
      return null;
    }
    return (
      <div>
        <form className="container-fluid" onSubmit={this.handleFormSubmit}>
          <FormGroup controlId="formBasicText">
            <Input
              inputType={"text"}
              title={"Name"}
              name={"name"}
              value={this.state.newCoop.name}
              placeholder={"Enter cooperative name"}
              handleChange={this.handleInput}
              errors={this.state.errors}
            />{" "}
            {/* Name of the cooperative */}
            <CoopTypes
              name={"types"}
              suggestions={this.state.coopTypes}
              values={this.state.newCoop.types}
              placeholder={"Enter coop type(s)"}
              handleAddition={this.handleCoopTypeAddition}
              handleDeletion={this.handleCoopTypeDeletion}
              errors={this.state.errors}
            />{" "}
            {/* Coop Type Selection */}
            <Input
              inputType={"text"}
              title={"Street"}
              name={"newCoop.addresses[0].formatted"}
              value={this.state.newCoop.addresses[0].formatted}
              placeholder={"Enter address street"}
              handleChange={this.handleInput}
              errors={this.state.errors}
            />{" "}
            {/* Address street of the cooperative */}
            <Input
              inputType={"text"}
              title={"City"}
              name={"newCoop.addresses[0].locality.name"}
              value={this.state.newCoop.addresses[0].locality.name}
              placeholder={"Enter address city"}
              handleChange={this.handleInput}
              errors={this.state.errors}
            />{" "}
            {/* Address city of the cooperative */}
            <Country
              title={"Country"}
              name={"newCoop.addresses[0].country"}
              options={this.state.countries}
              countryCode={this.state.newCoop.addresses[0].country.code}
              placeholder={"Select Country"}
              handleChange={this.handleInput}
            />{" "}
            {/* Country Selection */}
            <Province
              title={"State"}
              name={"newCoop.addresses[0].locality.state"}
              options={this.state.provinces}
              value={this.state.newCoop.addresses[0].locality.state}
              placeholder={"Select State"}
              handleChange={this.handleInput}
            />{" "}
            {/* State Selection */}
            <Input
              inputType={"text"}
              title={"Postal Code"}
              name={"newCoop.addresses[0].locality.postal_code"}
              value={this.state.newCoop.addresses[0].locality.postal_code}
              placeholder={"Enter postal code"}
              handleChange={this.handleInput}
              errors={this.state.errors}
            />{" "}
            {/* Address postal code of the cooperative */}
            <Input
              inputType={"text"}
              title={"Email"}
              name={"email.email"}
              value={this.state.newCoop.email.email}
              placeholder={"Enter email"}
              handleChange={this.handleInput}
              errors={this.state.errors}
            />{" "}
            {/* Email of the cooperative */}
            <Input
              inputType={"text"}
              title={"Phone"}
              name={"phone.phone"}
              value={this.state.newCoop.phone.phone}
              placeholder={"Enter phone number"}
              handleChange={this.handlePhoneInput}
              errors={this.state.errors}
            />{" "}
            {/* Phone number of the cooperative */}
            <Input
              inputType={"text"}
              title={"Web Site"}
              name={"web_site"}
              value={this.state.newCoop.web_site}
              placeholder={"Enter web site"}
              handleChange={this.handleInput}
              errors={this.state.errors}
            />{" "}
            {/* Web site of the cooperative */}
            <Button
              action={this.handleFormSubmit}
              type={"primary"}
              title={"Submit"}
              style={buttonStyle}
            />{" "}
            {/*Submit */}
            <Button
              action={this.handleClearForm}
              type={"secondary"}
              title={"Clear"}
              style={buttonStyle}
            />{" "}
            {/* Clear the form */}
          </FormGroup>
        </form>
      </div>
    );
  }

  componentDidMount() {
    let initialCountries = [];
    let initialProvinces = [];
    let coopTypes = [];
    // Get initial countries
    fetch(FormContainer.REACT_APP_PROXY + "/countries/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        initialCountries = data.map((country) => {
          return country;
        });
        this.setState({
          countries: initialCountries,
        });
      });
    // Get initial provinces (states)
    fetch(
      FormContainer.REACT_APP_PROXY +
        "/states/" +
        FormContainer.DEFAULT_COUNTRY_CODE
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        initialProvinces = data.map((province) => {
          return province;
        });
        this.setState({
          provinces: initialProvinces,
        });
      });
    // Get all possible coop types
    fetch(FormContainer.REACT_APP_PROXY + "/coop_types/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        coopTypes = data.map((coopType) => {
          return coopType;
        });
        console.log("coop types loaded!");
        console.log(coopTypes);
        this.setState({
          coopTypes: coopTypes,
        });
      });
  }
}

const buttonStyle = {
  margin: "10px 10px 10px 10px",
};

export default FormContainer;
