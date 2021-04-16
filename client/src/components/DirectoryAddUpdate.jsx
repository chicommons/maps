import React, { useEffect, useState } from 'react';
// import emailjs from "emailjs-com";
import { FormGroup } from "react-bootstrap";

import Country from "./Country.jsx";
import Province from "./Province.jsx";
import { DEFAULT_COUNTRY_CODE } from "../utils/constants"

import '../containers/FormContainer.css'

const { REACT_APP_PROXY } = process.env;

export default function DirectoryAddUpdate() {
    const [coopName, setCoopName] = useState("");
    const [street, setStreet] = useState("");
    const [addressPublic, setAddressPublic] = useState("yes");
    const [city, setCity] = useState("");
    // Make this drop down of actual states?
    const [state, setState] = useState("IL");
    // Should this be number?
    const [zip, setZip] = useState("");
    const [county, setCounty] = useState("");
    const [country, setCountry] = useState("US");
    const [websites, setWebsites] = useState([]);
    const [contactName, setContactName] = useState("");
    const [contactNamePublic, setContactNamePublic] = useState("yes");
    const [orgEmail, setOrgEmail] = useState("");
    const [orgEmailPublic, setOrgEmailPublic] = useState("yes");
    const [orgPhone, setOrgPhone] = useState("");
    const [orgPhonePublic, setOrgPhonePublic] = useState("yes");
    // Need to figure out this one as well. Start as array?
    const [entityTypes, setEntityTypes] = useState([]);
    const [scope, setScope] = useState("local");
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

        let data = JSON.stringify({
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
            "organization_email":orgEmail,
            "organization_email_public":orgEmailPublic,
            "organization_phone":orgPhone,
            "organization_phone_public":orgPhonePublic,
            // Entity types will need to be an array with .join(", ") once we can select multiple
            "entity_types":entityTypes,
            "scope":scope,
            "tags":tags.join(", "),
            "desc_english":descEng,
            "desc_other":descOther,
            "req_reason":reqReason
        })
        console.log(data);
        try {
            JSON.parse(data);
        } catch (e) {
            console.log("not JSON!")
            return false;
        }
        console.log("yes its json!")
        // return true;
        fetch(
                    "http://localhost:8000/save_to_sheet_from_form/",
                    {
                        method: "post",
                        headers: { 
                            'Content-Type': 'application/json',
                        },
                        body: data
                    }
         ).then(function(response) {
            console.log('Response:', response)
            return response.json();
        }).then(function(data) {
            console.log("Data is ok", data);
        }).catch(function(ex) {
            console.log("parsing failed", ex);
        })

        // Resets the initial form values
        setCoopName("");
        setStreet("");
        setAddressPublic("yes");
        setCity("");
        setState("IL");
        setZip("");
        setCounty("");
        setCountry("US");
        setWebsites([]);
        setContactName("");
        setContactNamePublic("yes");
        setOrgEmail("");
        setOrgEmailPublic("yes");
        setOrgPhone("");
        setOrgPhonePublic("yes");
        setEntityTypes([]);
        setScope("local");
        setTags([]);
        setDescEng("");
        setDescOther("");
        setReqReason("");
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
    <>
        <h1 className="form__title">Directory Form</h1>
        <h2 className="form__desc">Use this form to add or request the update of a solidarity entity or cooperative. We'll contact you to confirm the information</h2>
        <h2 className="form__desc"><span style={{color: "red"}}>*</span> = required</h2>
        <div className="form">  
            <form onSubmit={submitForm} className="container-fluid" id="directory-add-update">
                <FormGroup controlId="formBasicText">
                    <div className="form-group">
                        <label htmlFor="coop-name" className="required">Cooperative/Entity Name</label>
                        <input
                            type="text"
                            id="coop-name"
                            name="coop_name"
                            value={coopName}
                            placeholder="Enter cooperative/entity name"
                            onChange={(e) => setCoopName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="street" className="required">Street Address</label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={street}
                            placeholder="Enter address street"
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address-public">Address Public?</label>
                        <select
                            form="directory-add-update"
                            id="address-public"
                            name="address_public"
                            value={addressPublic}
                            onChange={(e) => setAddressPublic(e.target.value)}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={city}
                            placeholder="Enter address city"
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="state" className="required">State</label>
                        <select
                            form="directory-add-update"
                            id="state"
                            name="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}>
                            <option value="" disabled>
                                Select State
                            </option>
                             {
                                provinces.map((province) => (
                                    <option key={province.code} value={province.code}>
                                      {province.name}
                                    </option>
                                )
                             )}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="zip">Zip Code</label>
                        <input
                            type="text"
                            id="zip"
                            name="zip"
                            value={zip}
                            placeholder="Enter zip code"
                            onChange={(e) => {
                                setZip(e.target.value);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="county">County</label>
                        <input
                            type="text"
                            id="county"
                            name="county"
                            value={county}
                            placeholder="Enter county"
                            onChange={(e) => {
                                setCounty(e.target.value);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <select
                            form="directory-add-update"
                            id="country"
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}>
                            <option value="" disabled>
                                Select Country
                            </option>
                             {
                                countries.map((country) => (
                                    <option key={country.code} value={country.code}>
                                      {country.name}
                                    </option>
                                )
                             )}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="websites">Website or Social Media Page (separate multiple links with a comma)</label>
                        <input
                            type="text"
                            id="websites"
                            name="websites"
                            value={websites}
                            placeholder="Enter website or social media pages"
                            onChange={(e) => {
                                setWebsites(e.target.value.split(","));
                            }
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact-name">Contact Name</label>
                        <input
                            type="text"
                            id="contact-name"
                            name="contact_name"
                            value={contactName}
                            placeholder="Enter contact name"
                            onChange={(e) => setContactName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact-name-public">Contact Name Public?</label>
                        <select
                            form="directory-add-update"
                            id="contact-name-public"
                            name="contact_name_public"
                            value={contactNamePublic}
                            onChange={(e) => setContactNamePublic(e.target.value)}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="organization-email">Organization Email Address</label>
                        <input
                            type="email"
                            id="organization-email"
                            name="organization_email"
                            value={orgEmail}
                            placeholder="Enter organization email"
                            onChange={(e) => setOrgEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="organization-email-public">Email Public?</label>
                        <select
                            form="directory-add-update"
                            id="organization-email-public"
                            name="organization_email_public"
                            value={orgEmailPublic}
                            onChange={(e) => setOrgEmailPublic(e.target.value)}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="organization-phone">Organization Phone Number</label>
                        <input
                            type="tel"
                            id="organization-phone"
                            name="organization_phone"
                            value={orgPhone}
                            placeholder="Enter organization phone"
                            onChange={(e) => setOrgPhone(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="organization-phone-public">Phone Public?</label>
                        <select
                            form="directory-add-update"
                            id="organization-phone-public"
                            name="organization_phone_public"
                            value={orgPhonePublic}
                            onChange={(e) => setOrgPhonePublic(e.target.value)}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    {/* Functionality needs */}
                    <div className="form-group">
                        <label htmlFor="poi-types">Entity type</label>
                        <select
                            form="directory-add-update"
                            id="entity-types"
                            name="entity_types"
                            value={entityTypes}
                            onChange={(e) => setEntityTypes(e.target.value)}>
                            <option value="" disabled>
                                Select entity type
                            </option>
                             {
                                entities.map((entity) => (
                                    <option key={entity.id} value={entity.id}>
                                      {entity.name}
                                    </option>
                                )
                             )}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="scope">Scope of Service</label>
                        <select
                            form="directory-add-update"
                            id="scope"
                            name="scope"
                            value={scope}
                            onChange={(e) => setScope(e.target.value)}>
                            <option value="local">local</option>
                            <option value="regional">regional</option>
                            <option value="national">national</option>
                            <option value="international">international</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tags">Add description tags here, separated by commas</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={tags}
                            placeholder="Enter tags"
                            onChange={(e) => {
                                setTags(e.target.value.split(","));
                            }
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="desc-english">Entity Description (English)</label>
                        <textarea
                            id="desc-english"
                            name="desc_english"
                            value={descEng}
                            placeholder="Enter entity description (English)"
                            onChange={(e) => setDescEng(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="desc-other">Entity Description (Other Language)</label>
                        <textarea
                            id="desc-other"
                            name="desc_other"
                            value={descOther}
                            placeholder="Enter entity description (Other Language)"
                            onChange={(e) => setDescOther(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="req-reason">Please list your reason for submitting this request? Is this an addition or an update?</label>
                        <textarea
                            id="req-reason"
                            name="req_reason"
                            value={reqReason}
                            placeholder="Enter reason for request."
                            onChange={(e) => setReqReason(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="form-group">
                        <input className="submit" type="submit" value="SEND ADDITION/UPDATE" />
                    </div>
                </FormGroup>
            </form>
        </div>
    </>
    )
}
