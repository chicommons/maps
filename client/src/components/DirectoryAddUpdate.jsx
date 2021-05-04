import React, { useEffect, useState } from 'react';
// import emailjs from "emailjs-com";
import { FormGroup } from "react-bootstrap";

import Input from "../components/Input";
import DropDownInput from "../components/DropDownInput";
import EntityTypes from "../components/EntityTypes";
import TextAreaInput from "../components/TextAreaInput";


import Country from "./Country.jsx";
import Province from "./Province.jsx";
import { DEFAULT_COUNTRY_CODE } from "../utils/constants"

import '../containers/FormContainer.css'

const { REACT_APP_PROXY } = process.env;

export default function DirectoryAddUpdate() {
    const [coopName, setCoopName] = useState("");
    const [street, setStreet] = useState("");
    const [addressPublic, setAddressPublic] = useState("No");
    const [city, setCity] = useState("");
    // Make this drop down of actual states?
    const [state, setState] = useState("IL");
    // Should this be number?
    const [zip, setZip] = useState("");
    const [county, setCounty] = useState("");
    const [country, setCountry] = useState("US");
    const [websites, setWebsites] = useState([]);
    const [contactName, setContactName] = useState("");
    const [contactNamePublic, setContactNamePublic] = useState("No");
    const [contactEmail, setContactEmail] = useState("");
    const [contactEmailPublic, setContactEmailPublic] = useState("No");
    const [contactPhone, setContactPhone] = useState("");
    const [contactPhonePublic, setContactPhonePublic] = useState("No");
    // Need to figure out this one as well. Start as array?
    const [entityTypes, setEntityTypes] = useState([]);
    const [scope, setScope] = useState("Local");
    // Want separated by semicolons in form
    const [tags, setTags] = useState([]);
    const [descEng, setDescEng] = useState("");
    const [descOther, setDescOther] = useState("");
    // There's a request for a "Why are you submitting this?" textbox
    const [reqReason, setReqReason] = useState("");

    // Holds country and state list
    const [countries, setCountries] = React.useState([]);
    const [provinces, setProvinces] = React.useState([]);
    const [entities, setEntityTypeList] = React.useState([]);

    // Validation
    const [errors, setErrors] = React.useState([]);


    // Code for EmailJS, not using as of 4-7-21
    // const sendEmail = (e) => {
    //     e.preventDefault();

    //     emailjs
    //         .sendForm(
    //             "service_dpyos8k",
    //             "template_tysvot3",
    //             e.target,
    //             "user_KwHJEsdCYTvaCsb6JlxXk"
    //         )
    //         .then(
    //             (result) => {
    //                 console.log("It worked!");
    //                 console.log(result.text);
    //             },
    //             (error) => {
    //                 console.error("It didn't work");
    //                 console.error(error.text);
    //             }
    //         );
    // }

    const submitForm = (e) => {
        e.preventDefault();

        console.log("form submitted!");
        console.log(coopName);

        let formData = JSON.stringify({
            "coop_name":coopName,
            "street":street,
            "address_public":addressPublic,
            "city":city,
            "state":state,
            "zip":zip,
            "county":county,
            "country":country,
            "websites":websites.join(", "),
            "contact_name":contactName,
            "contact_name_public":contactNamePublic,
            "contact_email":contactEmail,
            "contact_email_public":contactEmailPublic,
            "contact_phone":contactPhone,
            "contact_phone_public":contactPhonePublic,
            // Entity types will need to be an array with .join(", ") once we can select multiple
            "entity_types":entityTypes,
            "scope":scope,
            "tags":tags.join(", "),
            "desc_english":descEng,
            "desc_other":descOther,
            "req_reason":reqReason
        })
        console.log(formData);
        try {
            JSON.parse(formData);
        } catch (e) {
            console.log("not JSON!")
            return false;
        }
        console.log("yes its json!")

        fetch(
                REACT_APP_PROXY + "/save_to_sheet_from_form/",
                    {
                        method: "post",
                        headers: { 
                            'Content-Type': 'application/json',
                        },
                        body: formData
                    }
         ).then(response => {
            if (response.ok) {
                console.log('Response:', response);
                return response.json();
              } else {
                throw response;
              }
        }).then(function(data) {
            console.log("Data is ok", data);

            // Resets the initial form values to clear the form
            // setCoopName("");
            // setStreet("");
            // setAddressPublic("No");
            // setCity("");
            // setState("IL");
            // setZip("");
            // setCounty("");
            // setCountry("US");
            // setWebsites([]);
            // setContactName("");
            // setContactNamePublic("No");
            // setContactEmail("");
            // setContactEmailPublic("No");
            // setContactPhone("");
            // setContactPhonePublic("No");
            // setEntityTypes([]);
            // setScope("Local");
            // setTags([]);
            // setDescEng("");
            // setDescOther("");
            // setReqReason("");

            // Instead maybe just refresh, so that the error messages go away too?
            window.location.reload();
        }).catch(err => {
            console.log("Errors ...");
            console.log(err);
            err.text().then((errorMessage) => {
                try {
                    JSON.parse(errorMessage)
                } catch (e) {
                    console.log(e)
                }
              setErrors(JSON.parse(errorMessage));

              return
            });
          })
    }

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

        //   Get initial entity types
        fetch(REACT_APP_PROXY + "/predefined_types/")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const initialEntityTypes = data.map((entity) => {
            return entity;
          });
          setEntityTypeList(initialEntityTypes);
        });
      }, []);

    return (
    <div className="directory-form">
        <h1 className="form__title">Directory Form</h1>
        <h2 className="form__desc">Use this form to add or request the update of a solidarity entity or cooperative. We'll contact you to confirm the information</h2>
        <h2 className="form__desc"><span style={{color: "red"}}>*</span> = required</h2>
        <div className="form">  
            <form onSubmit={submitForm} className="container-fluid" id="directory-add-update" noValidate>
                <FormGroup>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <Input 
                                className={"required"}
                                type={"text"}
                                title={"Cooperative/Entity Name"}
                                name={"coop_name"}
                                value={coopName}
                                placeholder={"Enter cooperative/entity name"}
                                handleChange={(e) => setCoopName(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-8">
                            <Input 
                                type={"text"}
                                title={"Street Address"}
                                name={"street"}
                                value={street}
                                placeholder={"Enter address street"}
                                handleChange={(e) => setStreet(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                        <div className="form-group col-md-4">
                            <DropDownInput 
                                type={"select"}
                                as={"select"}
                                title={"Address Public?"}
                                name={"address_public"}
                                value={addressPublic}
                                handleChange={(e) => setAddressPublic(e.target.value)}
                                options={["Yes", "No"]}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <Input 
                                type={"text"}
                                title={"City"}
                                name={"city"}
                                value={city}
                                placeholder={"Enter address city"}
                                handleChange={(e) => setCity(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                        <div className="form-group col-md-4">
                            <Province
                                title={"State"}
                                name={"state"}
                                options={provinces}
                                value={state}
                                placeholder={"Select State"}
                                handleChange={(e) => setState(e.target.value)}
                            />{" "}
                        </div>
                        <div className="form-group col-md-4">
                            <Input 
                                type={"text"}
                                title={"Zip Code"}
                                name={"zip"}
                                value={zip}
                                placeholder={"Enter zip code"}
                                handleChange={(e) => setZip(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <Input 
                                type={"text"}
                                title={"County"}
                                name={"county"}
                                value={county}
                                placeholder={"Enter county"}
                                handleChange={(e) => setCounty(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                        <div className="form-group col-md-6">
                            <Country
                                title={"Country"}
                                name={"country"}
                                options={countries}
                                value={country}
                                countryCode={"US"}
                                placeholder={"Select Country"}
                                handleChange={(e) => setCountry(e.target.value)}
                            />{" "}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <Input 
                                className={"required"}
                                type={"text"}
                                title={"Website or Social Media Page (separate multiple links with a comma)"}
                                name={"websites"}
                                value={websites}
                                placeholder={"Enter website or social media pages"}
                                handleChange={(e) => setWebsites(e.target.value.split(","))}
                                errors={errors}
                            />{" "}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-8">
                            <Input 
                                className={"required"}
                                type={"text"}
                                title={"Contact Name"}
                                name={"contact_name"}
                                value={contactName}
                                placeholder={"Enter contact name"}
                                handleChange={(e) => setContactName(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                        <div className="form-group col-md-4">
                            <DropDownInput 
                                className={"required"}
                                type={"select"}
                                as={"select"}
                                title={"Contact Name Public?"}
                                name={"contact_name_public"}
                                value={contactNamePublic}
                                handleChange={(e) => setContactNamePublic(e.target.value)}
                                options={["Yes", "No"]}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-8">
                            <Input 
                                type={"email"}
                                title={"Contact Email Address"}
                                name={"contact_email"}
                                value={contactEmail}
                                placeholder={"Enter contact email"}
                                handleChange={(e) => setContactEmail(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                        {contactEmail && (
                            <div className="form-group col-md-4">
                                <DropDownInput 
                                    className={"required"}
                                    type={"select"}
                                    as={"select"}
                                    title={"Email Public?"}
                                    name={"contact_email_public"}
                                    value={contactEmailPublic}
                                    handleChange={(e) => setContactEmailPublic(e.target.value)}
                                    options={["Yes", "No"]}
                                />
                            </div>
                        )}
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-8">
                            <Input 
                                type={"tel"}
                                title={"Contact Phone Number"}
                                name={"contact_phone"}
                                value={contactPhone}
                                placeholder={"Enter contact phone"}
                                handleChange={(e) => setContactPhone(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                        {contactPhone && (
                            <div className="form-group col-md-4">
                                <DropDownInput 
                                    className={"required"}
                                    type={"select"}
                                    as={"select"}
                                    title={"Phone Public?"}
                                    name={"contact_phone_public"}
                                    value={contactPhonePublic}
                                    handleChange={(e) => setContactPhonePublic(e.target.value)}
                                    options={["Yes", "No"]}
                                />
                            </div>
                        )}
                    </div>
                    {/* Need to figure out design with larger list */}
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <EntityTypes
                                type={"select"}
                                as={"select"}
                                title={"Entity types"}
                                name={"entity_types"}
                                value={entityTypes}
                                handleChange={e => setEntityTypes([].slice.call(e.target.selectedOptions).map(item => item.value))}
                                options={entities}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <DropDownInput 
                                type={"select"}
                                as={"select"}
                                title={"Scope of Service"}
                                name={"scope"}
                                value={scope}
                                handleChange={(e) => setScope(e.target.value)}
                                options={["Local", "Regional", "National", "International"]}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <Input 
                                type={"text"}
                                title={"Add description tags here, separated by commas"}
                                name={"tags"}
                                value={tags}
                                placeholder={"Enter tags"}
                                handleChange={(e) => setTags(e.target.value.split(","))}
                                errors={errors}
                            />{" "}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <TextAreaInput 
                                type={"textarea"}
                                as={"textarea"}
                                title={"Entity Description (English)"}
                                name={"desc_english"}
                                value={descEng}
                                placeholder={"Enter entity description (English)"}
                                handleChange={(e) => setDescEng(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <TextAreaInput 
                                type={"textarea"}
                                as={"textarea"}
                                title={"Entity Description (Other Language)"}
                                name={"desc_other"}
                                value={descOther}
                                placeholder={"Enter entity description (Other Language)"}
                                handleChange={(e) => setDescOther(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <TextAreaInput 
                                type={"textarea"}
                                as={"textarea"}
                                title={"Please list your reason for submitting this request? Is this an addition or an update?"}
                                name={"req_reason"}
                                value={reqReason}
                                placeholder={"Enter reason for request."}
                                handleChange={(e) => setReqReason(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                    </div>
                    <div className="form-group">
                        <input className="submit" type="submit" value="SEND ADDITION/UPDATE" />
                    </div>
                </FormGroup>
            </form>
        </div>
    </div>
    )
}
