import React, { Component } from "react";
import { FormGroup } from "react-bootstrap";

/* Import Components */
import Input from "../components/Input";
import Button from "../components/Button";
import { useHistory } from "react-router-dom";

const initPerson = (coop) => {
  return {
    first_name: "",
    last_name: "",
    coops: [coop],
    email: "",
    phone: "",
  };
};

class PersonFormContainer extends Component {
  static REACT_APP_PROXY = process.env.REACT_APP_PROXY;

  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      person: initPerson(props.coop),
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handlePhoneInput = this.handlePhoneInput.bind(this);
  }

  /* This life cycle hook gets executed when the component mounts */

  async handleFormSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        PersonFormContainer.REACT_APP_PROXY + "/people/",
        {
          method: "POST",
          body: JSON.stringify({
            first_name: this.state.person.first_name,
            last_name: this.state.person.last_name,
            coops: this.state.person.coops.map((coop) => coop.id),
            contact_methods: [
              {
                type: "PHONE",
                phone: this.state.person.phone,
              },
              {
                type: "EMAIL",
                email: this.state.person.email,
              },
            ],
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const history = useHistory();
        history.push({
          pathname: "/" + this.state.person.coops[0].id + "/listpeople",
          state: { coop: this.state.person.coops[0] },
        });
        window.scrollTo(0, 0);
        window.flash("Record has been created successfully!", "success");
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

  handleInput(e) {
    let self = this;
    let value = e.target.value;
    let name = e.target.name;
    console.log("name:" + name + " val:" + e.target.value);
    if (name.indexOf("[") === -1) {
      this.setValue(self.state.person, name, value);
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
    this.setValue(self.state.person, name, value);
  }

  setValue = (obj, is, value) => {
    if (typeof is == "string") return this.setValue(obj, is.split("."), value);
    else if (is.length === 1 && value !== undefined) {
      return this.setState({ obj: (obj[is[0]] = value) });
    } else if (is.length === 0) return obj;
    else return this.setValue(obj[is[0]], is.slice(1), value);
  };

  render() {
    console.log(" coop name: " + this.state.person.coops[0]?.name);
    return (
      <div>
        <div>{this.state.person.coops[0]?.name}</div>
        <form className="container-fluid" onSubmit={this.handleFormSubmit}>
          <FormGroup controlId="formBasicText">
            <Input
              inputType={"text"}
              title={"First Name"}
              name={"first_name"}
              value={this.state.person.first_name}
              placeholder={"Enter first name"}
              handleChange={this.handleInput}
              errors={this.state.errors}
            />{" "}
            {/* First name of the person */}
            <Input
              inputType={"text"}
              title={"Last Name"}
              name={"last_name"}
              value={this.state.person.last_name}
              placeholder={"Enter last name"}
              handleChange={this.handleInput}
              errors={this.state.errors}
            />{" "}
            {/* Last name of the person */}
            <Input
              inputType={"text"}
              title={"Email"}
              name={"email"}
              value={this.state.person.email}
              placeholder={"Enter email"}
              handleChange={this.handleInput}
              errors={this.state.errors}
            />{" "}
            {/* Email of the person */}
            <Input
              inputType={"text"}
              title={"Phone"}
              name={"phone"}
              value={this.state.person.phone}
              placeholder={"Enter primary phone number"}
              handleChange={this.handlePhoneInput}
              errors={this.state.errors}
            />{" "}
            {/* Phone number of the person */}
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
    // Load form object, if present in URL
    // URL will look like http://servername/coops/coop_id/people
    /* const url = window.location.href;
    console.log(url.split("/"));
    const urlParts = url.split("/");
    const coop_id = urlParts[urlParts.length - 2];
    console.log("starting fetch with coop id:" + coop_id);
    fetch(PersonFormContainer.REACT_APP_PROXY + "/coops/" + coop_id)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const coop = data;
        const { person } = { ...this.state };
        console.log(coop);
        person.coops.push(coop);
        console.log("added coop with name: " + person.coops[0].name);
        this.setState({
          person: person,
        });
      });
    */
  }
}

const buttonStyle = {
  margin: "10px 10px 10px 10px",
};

export default PersonFormContainer;
