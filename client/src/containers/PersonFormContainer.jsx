import React, { Component } from "react";
import { FormGroup } from "react-bootstrap";
import _ from "lodash";
import { useHistory } from "react-router-dom";

/* Import Components */
import Input from "../components/Input";
import Button from "../components/Button";

const { REACT_APP_PROXY } = process.env;

const handleClearForm = () => {
  // Logic for resetting the form
};

const PersonFormContainer = (props) => {
  const [person, setPerson] = React.useState(props.person);
  const [errors, setErrors] = React.useState([]);
  const [coop, setCoop] = React.useState(props.coop);
  const history = useHistory();

  const handleInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    console.log("changing " + name + " to " + value);
    console.log(person);
    if (name.indexOf("[") === -1) {
      setValue(name, value);
    } else {
      const personCopy = JSON.parse(JSON.stringify(person));
      const keys = name.split(/[\[\].]+/);
      _.set(personCopy, name, value);
      console.log("changed person to ...");
      console.log(personCopy);
      setPerson(personCopy);
    }
  };

  const updateValue = (obj, name, value, index = 0) => {
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
  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/, "");
    value = value.length > 10 ? value.substring(0, 10) : value;
    let name = e.target.name;
    //update phone
    setValue(name, value);
  };

  const setValue = (is, value) => {
    const personCopy = JSON.parse(JSON.stringify(person));
    if (typeof is == "string") {
      console.log("setting string value");
      _.set(personCopy, is, value);
      return setPerson(personCopy);
    } else if (is.length === 1 && value !== undefined) {
      _.set(personCopy, is, value);
      return setPerson(personCopy);
    } else if (is.length === 0) return person;
    else {
      console.log("is:" + is + " value:" + value);
      return setValue(is.slice(1), value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Make a copy of the object in order to remove unneeded properties

    const url = person.id
      ? REACT_APP_PROXY + "/people/" + person.id
      : REACT_APP_PROXY + "/people/";
    const method = person.id ? "PATCH" : "POST";
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        first_name: person.first_name,
        last_name: person.last_name,
        coops: person.coops.map((coop) => coop.id),
        contact_methods: [
          {
            type: "PHONE",
            phone: person.phone,
          },
          {
            type: "EMAIL",
            email: person.email,
          },
        ],
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        const result = data;
        window.location.href = "/" + person.coops[0].id + "/listpeople";
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.log(err);
        err.text().then((errorMessage) => {
          setErrors(JSON.parse(errorMessage));
        });
      });
  };

  /* This life cycle hook gets executed when the component mounts */

  return (
    <div>
      <h5>Add Person Info</h5>
      <div>{person.coops[0]?.name}</div>
      <form className="container-fluid" onSubmit={handleFormSubmit}>
        <FormGroup controlId="formBasicText">
          <Input
            inputType={"text"}
            title={"First Name"}
            name={"first_name"}
            value={person.first_name}
            placeholder={"Enter first name"}
            handleChange={handleInput}
            errors={errors}
          />{" "}
          {/* First name of the person */}
          <Input
            inputType={"text"}
            title={"Last Name"}
            name={"last_name"}
            value={person.last_name}
            placeholder={"Enter last name"}
            handleChange={handleInput}
            errors={errors}
          />{" "}
          {/* Last name of the person */}
          <Input
            inputType={"text"}
            title={"Email"}
            name={"email"}
            value={person.email}
            placeholder={"Enter email"}
            handleChange={handleInput}
            errors={errors}
          />{" "}
          {/* Email of the person */}
          <Input
            inputType={"text"}
            title={"Phone"}
            name={"phone"}
            value={person.phone}
            placeholder={"Enter primary phone number"}
            handleChange={handlePhoneInput}
            errors={errors}
          />{" "}
          {/* Phone number of the person */}
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

export default PersonFormContainer;
