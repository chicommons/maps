import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
// import emailjs from "emailjs-com";
import { FormGroup } from "react-bootstrap";

import Input from "../components/Input";
import DropDownInput from "../components/DropDownInput";
import TextAreaInput from "../components/TextAreaInput";


import Country from "./Country.jsx";
import Province from "./Province.jsx";
import { DEFAULT_COUNTRY_CODE } from "../utils/constants"

import '../containers/FormContainer.css'

const { REACT_APP_PROXY } = process.env;

export default function DirectoryAddUpdate() {
    const [coopName, setCoopName] = useState("");
    const [street, setStreet] = useState("");
    const [addressPublic, setAddressPublic] = useState("no");
    const [city, setCity] = useState("");
    const [state, setState] = useState("IL");
    const [zip, setZip] = useState("");
    const [county, setCounty] = useState("");
    const [country, setCountry] = useState("US");
    const [websites, setWebsites] = useState([]);
    const [contactName, setContactName] = useState("");
    const [contactNamePublic, setContactNamePublic] = useState("no");
    const [contactEmail, setContactEmail] = useState("");
    const [contactEmailPublic, setContactEmailPublic] = useState("no");
    const [contactPhone, setContactPhone] = useState("");
    const [contactPhonePublic, setContactPhonePublic] = useState("no");
    const [entityTypes, setEntityTypes] = useState([]);
    const [scope, setScope] = useState("local");
    const [tags, setTags] = useState([]);
    const [descEng, setDescEng] = useState("");
    const [descOther, setDescOther] = useState("");
    const [reqReason, setReqReason] = useState("add");

    // Holds country and state list
    const [countries, setCountries] = React.useState([]);
    const [provinces, setProvinces] = React.useState([]);
    const [entities, setEntityTypeList] = React.useState([]);

    // Validation
    const [errors, setErrors] = React.useState([]);

    // While loading coop data from ID
    const [loadingCoopData, setLoadingCoopData] = React.useState(false);

    // Gets id from URL
    const { id } = useParams();

    const fetchCoopForUpdate = async () => {
        console.log(id);
        setLoadingCoopData(true);

        try {
            const res = await fetch(REACT_APP_PROXY + `/coops/${id}/`);
            if(!res.ok) {
                throw Error("Cannot access requested entity.")
            }
            const coopResults = await res.json();
            console.log(coopResults);

            setCoopName(coopResults.name ?coopResults.name : "");
            setStreet(coopResults.addresses[0].formatted ? coopResults.addresses[0].formatted : "");
            setCity(coopResults.addresses[0].locality.name ? coopResults.addresses[0].locality.name : "");
            setState(coopResults.addresses[0].locality.state.code ? coopResults.addresses[0].locality.state.code : "");
            setZip(coopResults.addresses[0].locality.postal_code ? coopResults.addresses[0].locality.postal_code : "");
            // setCounty();
            setCountry(coopResults.addresses[0].locality.state.country.code ? coopResults.addresses[0].locality.state.country.code : "");
            // setAddressPublic();
            setWebsites(coopResults.web_site ? coopResults.web_site : "");
            // setContactName();
            // setContactNamePublic();
            setContactEmail(coopResults.email ? coopResults.email : "");
            // setContactEmailPublic();
            setContactPhone(coopResults.phone ? coopResults.phone.phone : "");
            // setContactPhonePublic();
            // Need to figure out how entity types look in data if there are multiple
            setEntityTypes([coopResults.types[0]] ? [coopResults.types[0].name] : []);
            // setScope();
            // setTags([]);
            // setDescEng("");
            // setDescOther("");
            setReqReason("update");
        } catch (error) {
            console.log(error);
            setErrors(`Error: ${error.message}`)
        }
        setLoadingCoopData(false);
    };


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
            // "entity_types":entityTypes,
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
            // setAddressPublic("no");
            // setCity("");
            // setState("IL");
            // setZip("");
            // setCounty("");
            // setCountry("US");
            // setWebsites([]);
            // setContactName("");
            // setContactNamePublic("no");
            // setContactEmail("");
            // setContactEmailPublic("no");
            // setContactPhone("");
            // setContactPhonePublic("no");
            // setEntityTypes([]);
            // setScope("local");
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
                } 
                catch (e) {
                    console.log(e)
                    console.log(errorMessage);
                    return
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

        if (id) {
            fetchCoopForUpdate();
        }
      }, []);

    return (
    <div className="directory-form">
        <h1 className="form__title">Directory Form</h1>
        <h2 className="form__desc">Use this form to add or request the update of a solidarity entity or cooperative. We'll contact you to confirm the information</h2>
        <h2 className="form__desc"><span style={{color: "red"}}>*</span> = required</h2>
        { errors && <strong className="form__error-message">{errors}</strong>}
        { loadingCoopData && <strong>Loading entity data...</strong>}
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
                        <div className="form-group col-md-3">
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
                        <div className="form-group col-md-3">
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
                        <div className="form-group col-md-3">
                            <Province
                                title={"State"}
                                name={"state"}
                                options={provinces}
                                value={state}
                                placeholder={"Select State"}
                                handleChange={(e) => setState(e.target.value)}
                            />{" "}
                        </div>
                        <div className="form-group col-md-3">
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
                        <div className="form-group col-md-3">
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
                        <div className="form-group col-md-3">
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
                        <div className="form-group col-md-6">
                            <DropDownInput 
                                type={"select"}
                                as={"select"}
                                title={"Is Address to be public on the map?"}
                                name={"address_public"}
                                value={addressPublic}
                                multiple={""}
                                handleChange={(e) => setAddressPublic(e.target.value)}
                                options={[{"id":"yes","name":"Yes"}, {"id":"no", "name":"No"}]}
                            />
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
                        <div className="form-group col-md-6">
                            <Input 
                                className={"required"}
                                type={"text"}
                                title={"Cooperative/Entity Contact Person Name"}
                                name={"contact_name"}
                                value={contactName}
                                placeholder={"Enter contact name"}
                                handleChange={(e) => setContactName(e.target.value)}
                                errors={errors}
                            />{" "}
                        </div>
                        <div className="form-group col-md-6">
                            <DropDownInput 
                                className={"required"}
                                type={"select"}
                                as={"select"}
                                title={"Is Contact name to be public on the map?"}
                                name={"contact_name_public"}
                                value={contactNamePublic}
                                multiple={""}
                                handleChange={(e) => setContactNamePublic(e.target.value)}
                                options={[{"id":"yes","name":"Yes"}, {"id":"no", "name":"No"}]}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
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
                            <div className="form-group col-md-6">
                                <DropDownInput 
                                    className={"required"}
                                    type={"select"}
                                    as={"select"}
                                    title={"Is Email to be public on the map?"}
                                    name={"contact_email_public"}
                                    multiple={""}
                                    value={contactEmailPublic}
                                    handleChange={(e) => setContactEmailPublic(e.target.value)}
                                    options={[{"id":"yes","name":"Yes"}, {"id":"no", "name":"No"}]}
                                />
                            </div>
                        )}
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
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
                            <div className="form-group col-md-6">
                                <DropDownInput 
                                    className={"required"}
                                    type={"select"}
                                    as={"select"}
                                    title={"Is Phone number to be public on the map?"}
                                    name={"contact_phone_public"}
                                    value={contactPhonePublic}
                                    multiple={""}
                                    handleChange={(e) => setContactPhonePublic(e.target.value)}
                                    options={[{"id":"yes","name":"Yes"}, {"id":"no", "name":"No"}]}
                                />
                            </div>
                        )}
                    </div>
                    {/* Need to figure out design with larger list */}
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <DropDownInput
                                type={"select"}
                                as={"select"}
                                title={"Entity types"}
                                multiple={"multiple"}
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
                                multiple={""}
                                handleChange={(e) => setScope(e.target.value)}
                                options={[{"id":"local","name":"Local"}, {"id":"regional", "name":"Regional"},{"id":"national","name":"National"},{"id":"international", "name":"International"}]}                            
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
                            <DropDownInput 
                                className={"required"}
                                type={"select"}
                                as={"select"}
                                title={"Please list your reason for submitting this request"}
                                name={"req_reason"}
                                value={reqReason}
                                multiple={""}
                                handleChange={(e) => setReqReason(e.target.value)}
                                options={[{"id":"add","name":"Add new record"}, {"id":"update", "name":"Update existing record"}]}
                            />
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
