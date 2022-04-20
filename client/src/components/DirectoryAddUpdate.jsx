import React, { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";

import { FormGroup } from "react-bootstrap";

import CoopService from "../services/CoopService";
import Input from "../components/Input";
import DropDownInput from "../components/DropDownInput";
import TextAreaInput from "../components/TextAreaInput";

import Country from "./Country.jsx";
import Province from "./Province.jsx";
import { DEFAULT_COUNTRY_CODE, DEFAULT_FORM_YES_NO } from "../utils/constants";

import { useAlert } from "../components/AlertProvider";

import Button from "../components/Button";

import "../containers/FormContainer.css";
import CancelButton from "./CancelButton";

const { REACT_APP_PROXY } = process.env;

export default function DirectoryAddUpdate() {
  const [coopObj, setCoopObj] = useState({});
  const [coopName, setCoopName] = useState("");
  const [street, setStreet] = useState("");
  const [addressPublic, setAddressPublic] = useState(DEFAULT_FORM_YES_NO);
  const [city, setCity] = useState("");
  const [state, setState] = useState("IL");
  const [zip, setZip] = useState("");
  const [county, setCounty] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY_CODE);
  const [websites, setWebsites] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNamePublic, setContactNamePublic] = useState(DEFAULT_FORM_YES_NO);
  const [contactEmail, setContactEmail] = useState("");
  const [contactEmailPublic, setContactEmailPublic] = useState(DEFAULT_FORM_YES_NO);
  const [contactPhone, setContactPhone] = useState("");
  const [contactPhonePublic, setContactPhonePublic] = useState(DEFAULT_FORM_YES_NO);
  const [entityTypes, setEntityTypes] = useState([]);
  const [scope, setScope] = useState("Local");
  const [tags, setTags] = useState("");
  const [descEng, setDescEng] = useState("");
  const [descOther, setDescOther] = useState("");
  const [reqReason, setReqReason] = useState("Add new record");



  // Holds country and state list
  const [countries, setCountries] = React.useState([]);
  const [provinces, setProvinces] = React.useState([]);
  const [entities, setEntityTypeList] = React.useState([]);

  // Validation
  const [errors, setErrors, getErrors] = React.useState();

  // Errors when loading already existing entity
  const [loadErrors, setLoadErrors] = React.useState("");

  // While loading coop data from ID
  const [loadingCoopData, setLoadingCoopData] = React.useState(false);

  // Alert provider state
  const [ open ] = useAlert();

  // Gets id from URL
  const { id } = useParams();

  // State for Coop Approve page
  const [approvalForm, setApprovalForm] = React.useState(false);

  const clearForm = () => {
    // Resets the initial form values to clear the form
    setCoopName("");
    setStreet("");
    setAddressPublic(DEFAULT_FORM_YES_NO);
    setCity("");
    setState("IL");
    setZip("");
    setCounty("");
    setCountry(DEFAULT_COUNTRY_CODE);
    setWebsites("");
    setContactName("");
    setContactNamePublic(DEFAULT_FORM_YES_NO);
    setContactEmail("");
    setContactEmailPublic(DEFAULT_FORM_YES_NO);
    setContactPhone("");
    setContactPhonePublic(DEFAULT_FORM_YES_NO);
    setEntityTypes([]);
    setScope("Local");
    setTags("");
    setDescEng("");
    setDescOther("");
    setErrors();
  }

  const oldValues = {};

  function convertProposedChanges() {
    if (coopObj.proposed_changes.name) {
      oldValues.coop_name = coopName;
      setCoopName(coopObj.proposed_changes.name);
    }
    if (coopObj.proposed_changes.email.email) {
      oldValues.contact_email = contactEmail;
      setContactEmail(coopObj.proposed_changes.email.email);
    }
    if (coopObj.proposed_changes.phone.phone) {
      oldValues.contact_phone = contactPhone;
      setContactPhone(coopObj.proposed_changes.phone.phone);
    }
    if (coopObj.proposed_changes.types) {
      oldValues.entity_types = entityTypes;
      setEntityTypes(coopObj.proposed_changes.types.map(item => item.name));
    }

    // Should this be set up for multiple sites?
    if (coopObj.proposed_changes.web_site) {
      oldValues.websites = websites;
      setWebsites(coopObj.proposed_changes.web_site);
    }

    if (coopObj.proposed_changes.coopaddresstags_set[0].address.formatted) {
      oldValues.street = street;
      setStreet(coopObj.proposed_changes.coopaddresstags_set[0].address.formatted);
    }
    if (coopObj.proposed_changes.coopaddresstags_set[0].address.locality.name) {
      oldValues.city = city;
      setCity(coopObj.proposed_changes.coopaddresstags_set[0].address.locality.name);
    }
    if (coopObj.proposed_changes.coopaddresstags_set[0].address.locality.state.code) {
      oldValues.state = state;
      setState(coopObj.proposed_changes.coopaddresstags_set[0].address.locality.state.code);
    }
    if (coopObj.proposed_changes.coopaddresstags_set[0].address.locality.postal_code) {
      oldValues.zip = zip;
      setZip(coopObj.proposed_changes.coopaddresstags_set[0].address.locality.postal_code);
    }
    if (coopObj.proposed_changes.coopaddresstags_set[0].is_public) {
      oldValues.address_public = addressPublic;
      setAddressPublic(coopObj.proposed_changes.coopaddresstags_set[0].is_public);
    }
    if (coopObj.proposed_changes.description) {
      oldValues.description = descEng;
      setDescEng(coopObj.proposed_changes.description);
    }
  }

  function checkExistingEntity() {
    if (coopObj.proposed_changes) {
      convertProposedChanges();
    }

    let formElements = document.querySelectorAll('.form-control');

    formElements.forEach(input => {
      if (oldValues.hasOwnProperty(input.name)) {
        input.classList.add('new-data');
        let newText = document.createElement('span');
        newText.classList.add('old-data');
        newText.innerHTML = `${oldValues[input.name] ? oldValues[input.name] : "Not filled"}`;
        input.parentNode.insertBefore(newText, input.nextSibling);
      }; 
    })
  }

  // Check required fields to see if they're still blank 
  const requiredFields = [coopName, websites, contactName, contactEmail, contactPhone, entityTypes];

  const updateRequired = (field) => {
    const asArray = Object.entries(errors);

    let filteredItem = "";

    switch(field) {
      case coopName:
        filteredItem = "coop_name";
        break;
      case websites:
        filteredItem = "websites";
        break;
      case contactName:
        filteredItem = "contact_name";
        break;
      case contactEmail:
        filteredItem = "contact";
        break;
      case contactPhone:
        filteredItem = "contact";
        break;
      case entityTypes:
        filteredItem = "entity_types";
        break;
    }

    if (errors.hasOwnProperty(filteredItem)) {
      setErrors(Object.fromEntries(asArray.filter(([key, value]) => key !== filteredItem)));
    };
  }

  const checkRequired = () => {
    if (!errors) {
      return
    } else {
      requiredFields.forEach(field => {
        if (field.length !== 0) {
          updateRequired(field);
        }
      })
    }
  }

  // Router history for bringing user to search page on submit
  const history = useHistory();

  const fetchCoopForUpdate = async () => {
    setLoadingCoopData(true);

    try {
      const res = await fetch(REACT_APP_PROXY + `/coops/${id}/`);
      if (!res.ok) {
        throw Error("Cannot access requested entity.");
      }
      const coopResults = await res.json();

      setCoopName(coopResults.name ? coopResults.name : "");
      setStreet(
        coopResults.coopaddresstags_set[0].address.formatted
          ? coopResults.coopaddresstags_set[0].address.formatted
          : ""
      );
      setCity(
        coopResults.coopaddresstags_set[0].address.locality.name
          ? coopResults.coopaddresstags_set[0].address.locality.name
          : ""
      );
      setState(
        coopResults.coopaddresstags_set[0].address.locality.state.code
          ? coopResults.coopaddresstags_set[0].address.locality.state.code
          : ""
      );
      setZip(
        coopResults.coopaddresstags_set[0].address.locality.postal_code
          ? coopResults.coopaddresstags_set[0].address.locality.postal_code
          : ""
      );
      setCountry(
        coopResults.coopaddresstags_set[0].address.locality.state.country.code
          ? coopResults.coopaddresstags_set[0].address.locality.state.country.code
          : ""
      );
      setWebsites(coopResults.web_site ? coopResults.web_site : "");
      setContactEmail(coopResults.email ? coopResults.email : "");
      setContactPhone(coopResults.phone ? coopResults.phone.phone : "");
      setEntityTypes(
        [coopResults.types[0]]
          ? [coopResults.types.map((type) => type.name)]
          : []
      );
      setDescEng(coopResults.description ? coopResults.description : "");
      setReqReason("Update existing record");
      setCoopObj(coopResults);
    } catch (error) {
      console.error(error);
      setLoadErrors(`Error: ${error.message}`);
    } finally {
      setLoadingCoopData(false);

      if (location.pathname.includes("approve")) {
        setApprovalForm(true);
      }
    }
  };

  // APPROVAL TEST
  const location = useLocation();

  const submitApprovalForm = () => {
    console.log("submitting the approval form");
  }

  const submitForm = (e) => {
    e.preventDefault();

    if (approvalForm) {
      submitApprovalForm();
      return;
    }

    let result = entityTypes.map(type => ({name: type}));
    let formData = {
      id: id,
      name: coopName,
      types: result,
      coopaddresstags_set: [
        {
          is_public: true,
          address: {
            raw: street,
            formatted: street,
            locality: {
              name: city,
              postal_code: zip,
              state: {
                name: state,
                code: state,
                country: {
                  name: 'United States'
                }
              },
            },
          }
        }
      ],
      phone: {
        phone: contactPhone
      },
      email: {
        email : contactEmail
      },
      web_site: websites,
      description: descEng
    };

    console.log("saving with id " + id);
    
    CoopService.saveAsConsumer(
      formData,
      (errors) => {
        //setButtonDisabled(false);
        setErrors(errors);
      },
      function (data) {
        const result = data;
        clearForm();
        window.scrollTo(0, 0);

        // Alert message
        const message = `Form Submission for ${coopName} successful`
        if (message) open(message);

        // If update request, redirects user to search page on form submit.
        if (id) {
          history.push('/search');
        }
      }
    );
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

    // TESTING WITH APPROVAL FUNCTIONALITY
    console.log(location.pathname);

    if (id) {
      console.log("there is an id");

      console.log(location.pathname.includes("approve"));

      if (location.pathname.includes("approve")) {
        setApprovalForm(true);
      }

      fetchCoopForUpdate();
    }
  }, []);

  useEffect(() => {
    if (location.pathname.includes("approve")) {
      checkExistingEntity();
    }
  }, [coopObj]);

  // Checking required field changes with useEffect.
  useEffect(() => {
      checkRequired();
    },
    requiredFields);

  return (
    <div className="directory-form">
      <h1 className="form__title">
        {approvalForm ? 
          <>Approval Form</> 
        : 
          <>Directory Form</>
        }
      </h1>

      <h2 className="form__desc">
        {approvalForm ? 
          <>For approving new or existing coops. If existing coop, updated data will be shown in red.</>
        : 
          <>Use this form to add or request the update of a solidarity entity or
          cooperative. We'll contact you to confirm the information</>
        }

      </h2>
      <h2 className="form__desc">
        <span style={{ color: "red" }}>*</span> = required
      </h2>
      {loadErrors && (
        <strong className="form__error-message">
          {JSON.stringify(loadErrors)}
        </strong>
      )}
      {loadingCoopData && <strong>Loading entity data...</strong>}
      <div className="form">
        <form
        onSubmit={submitForm}
        className="container-fluid"
        id="directory-add-update"
        noValidate>
          <FormGroup>
            <div className="form-row">
              <div className="form-group col-md-6 col-lg-4 col-xl-3">
                <Input
                  className={"required"}
                  type={"text"}
                  title={"Cooperative/Entity Name"}
                  name={"coop_name"}
                  value={coopName}
                  placeholder={"Cooperative/entity name"}
                  handleChange={(e) => setCoopName(e.target.value)}
                  errors={errors}
                />{" "}
              </div>
              <div className="form-group col-md-6 col-lg-3 col-xl-3">
                <Input
                  type={"text"}
                  title={"Street Address"}
                  name={"street"}
                  value={street}
                  placeholder={"Address street"}
                  handleChange={(e) => setStreet(e.target.value)}
                  errors={errors}
                />{" "}
              </div>
              <div className="form-group col-md-4 col-lg-3 col-xl-2">
                <Input
                  type={"text"}
                  title={"City"}
                  name={"city"}
                  value={city}
                  placeholder={"Address city"}
                  handleChange={(e) => setCity(e.target.value)}
                  errors={errors}
                />{" "}
              </div>
              <div className="form-group col-md-3 col-lg-2 col-xl-2">
                <Province
                  title={"State"}
                  name={"state"}
                  options={provinces}
                  value={state}
                  placeholder={"Select State"}
                  handleChange={(e) => setState(e.target.value)}
                />{" "}
              </div>
              <div className="form-group col-md-2 col-lg-2 col-xl-2">
                <Input
                  type={"text"}
                  title={"Zip Code"}
                  name={"zip"}
                  value={zip}
                  placeholder={"Zip code"}
                  handleChange={(e) => setZip(e.target.value)}
                  errors={errors}
                />{" "}
              </div>
              <div className="form-group col-md-3 col-lg-2 col-xl-3">
                <Input
                  type={"text"}
                  title={"County"}
                  name={"county"}
                  value={county}
                  placeholder={"County"}
                  handleChange={(e) => setCounty(e.target.value)}
                  errors={errors}
                />{" "}
              </div>
              <div className="form-group col-md-4 col-lg-2 col-xl-3">
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
              <div className="form-group col-md-8 col-lg-6 col-xl-5">
                <DropDownInput
                  type={"select"}
                  as={"select"}
                  title={"Is Address to be public on the map?"}
                  name={"address_public"}
                  value={addressPublic}
                  multiple={""}
                  handleChange={(e) => setAddressPublic(e.target.value)}
                  options={[
                    { id: "yes", name: "Yes" },
                    { id: "no", name: "No" },
                  ]}
                />
              </div>
              <div className="form-group col-md-12">
                <Input
                  className={"required"}
                  type={"text"}
                  title={
                    "Website or Social Media Page (separate multiple links with a comma)"
                  }
                  name={"websites"}
                  value={websites}
                  placeholder={"Website or social media pages"}
                  handleChange={(e) => setWebsites(e.target.value)}
                  errors={errors}
                />{" "}
              </div>
              <div className="form-group col-md-6">
                <Input
                  className={"required"}
                  type={"text"}
                  title={"Cooperative/Entity Contact Person Name"}
                  name={"contact_name"}
                  value={contactName}
                  placeholder={"Contact name"}
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
                  options={[
                    { id: "yes", name: "Yes" },
                    { id: "no", name: "No" },
                  ]}
                />
              </div>
              <div className="form-group col-12 form__desc required">
                You must include at least either a phone number or an e-mail address.
              </div>
              <div className="form-group col-md-4 col-lg-4">
                <Input
                  type={"email"}
                  title={"Contact Email Address"}
                  name={"contact_email"}
                  value={contactEmail}
                  placeholder={"Contact email"}
                  handleChange={(e) => setContactEmail(e.target.value)}
                  errors={errors}
                />{" "}
              </div>
              {contactEmail ? (
                <div className="form-group col-md-6 col-lg-6">
                  <DropDownInput
                    className={"required"}
                    type={"select"}
                    as={"select"}
                    title={"Is Email to be public on the map?"}
                    name={"contact_email_public"}
                    multiple={""}
                    value={contactEmailPublic}
                    handleChange={(e) => setContactEmailPublic(e.target.value)}
                    options={[
                      { id: "yes", name: "Yes" },
                      { id: "no", name: "No" },
                    ]}
                  />
                </div>
              ) : (
                <div className="form-group col-md-6 col-lg-6"></div>
              )}
              <div className="form-group col-md-4 col-lg-4">
                <Input
                  type={"tel"}
                  title={"Contact Phone Number"}
                  name={"contact_phone"}
                  value={contactPhone}
                  placeholder={"Contact phone"}
                  handleChange={(e) => setContactPhone(e.target.value)}
                  errors={errors}
                />{" "}
              </div>
              {contactPhone ? (
                <div className="form-group col-md-8 col-lg-6">
                  <DropDownInput
                    className={"required"}
                    type={"select"}
                    as={"select"}
                    title={"Is Phone number to be public on the map?"}
                    name={"contact_phone_public"}
                    value={contactPhonePublic}
                    multiple={""}
                    handleChange={(e) => setContactPhonePublic(e.target.value)}
                    options={[
                      { id: "yes", name: "Yes" },
                      { id: "no", name: "No" },
                    ]}
                  />
                </div>
              ) : (
                <div className="form-group col-md-8 col-lg-6"></div>
              )}
              <div className="col-12">
                <Input
                  type={"hidden"}
                  title={""}
                  name={"contact"}
                  value={''}
                  placeholder={"Contact info"}
                  errors={errors}
                  required={0}
                />{" "}
              </div>
              <div className="form-group col-md-6 col-lg-6">
                <DropDownInput
                  className={"required"}
                  type={"select"}
                  as={"select"}
                  title={"Entity types"}
                  multiple={"multiple"}
                  name={"entity_types"}
                  value={entityTypes}
                  handleChange={(e) =>
                    setEntityTypes(
                      [].slice
                        .call(e.target.selectedOptions)
                        .map((item) => item.value)
                    )
                  }
                  options={entities}
                  errors={errors}
                />
              </div>
              <div className="form-group col-md-6 col-lg-4">
                <DropDownInput
                  type={"select"}
                  as={"select"}
                  title={"Scope of Service"}
                  name={"scope"}
                  value={scope}
                  multiple={""}
                  handleChange={(e) => setScope(e.target.value)}
                  options={[
                    { id: "local", name: "Local" },
                    { id: "regional", name: "Regional" },
                    { id: "national", name: "National" },
                    { id: "international", name: "International" },
                  ]}
                />
              </div>
              <div className="form-group col-md-12 col-lg-12 col-xl-10">
                <Input
                  type={"text"}
                  title={"Add description tags here, separated by commas"}
                  name={"tags"}
                  value={tags}
                  placeholder={"Enter tags"}
                  handleChange={(e) => setTags(e.target.value)}
                  errors={errors}
                />{" "}
              </div>
              <div className="form-group col-md-12 col-lg-6 col-xl-4">
                <TextAreaInput
                  type={"textarea"}
                  as={"textarea"}
                  title={"Entity Description (English)"}
                  name={"description"}
                  value={descEng}
                  placeholder={"Enter entity description (English)"}
                  handleChange={(e) => setDescEng(e.target.value)}
                  errors={errors}
                />{" "}
              </div>
              <div className="form-group col-md-12 col-lg-6 col-xl-4">
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
              <div className="form-group col-md-8 col-lg-8 col-xl-4">
                <DropDownInput
                  className={"required"}
                  type={"select"}
                  as={"select"}
                  title={"Please list your reason for submitting this request"}
                  name={"req_reason"}
                  value={reqReason}
                  multiple={""}
                  handleChange={(e) => setReqReason(e.target.value)}
                  options={[
                    { id: "add", name: "Add new record" },
                    { id: "update", name: "Update existing record" },
                  ]}
                />
              </div>
              <div className="form-group col-md-6" align="center">
                {approvalForm ? 
                    <Button buttonType={"primary"} title={"Approve"} type={"submit"} />
                  :
                    <Button buttonType={"primary"} title={"Send Addition/Update"} type={"submit"} />
                }
              </div>
              <div className="form-group col-md-6" align="center">
                <CancelButton id={id} />
              </div>
            </div>
            {errors && (
              <strong className="form__error-message">
                Please correct the errors above and then resubmit.
              </strong>
            )}
          </FormGroup>
        </form>
      </div>
    </div>
  );
}
