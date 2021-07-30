import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

// import emailjs from "emailjs-com";
import { FormGroup } from "react-bootstrap";

import CoopService from "../services/CoopService";
import Input from "../components/Input";
import DropDownInput from "../components/DropDownInput";
import TextAreaInput from "../components/TextAreaInput";

import Country from "./Country.jsx";
import Province from "./Province.jsx";
import { DEFAULT_COUNTRY_CODE } from "../utils/constants";

import "../containers/FormContainer.css";

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
  const [websites, setWebsites] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNamePublic, setContactNamePublic] = useState("no");
  const [contactEmail, setContactEmail] = useState("");
  const [contactEmailPublic, setContactEmailPublic] = useState("no");
  const [contactPhone, setContactPhone] = useState("");
  const [contactPhonePublic, setContactPhonePublic] = useState("no");
  const [entityTypes, setEntityTypes] = useState([]);
  const [scope, setScope] = useState("local");
  const [tags, setTags] = useState("");
  const [descEng, setDescEng] = useState("");
  const [descOther, setDescOther] = useState("");
  const [reqReason, setReqReason] = useState("add");

  // Holds country and state list
  const [countries, setCountries] = React.useState([]);
  const [provinces, setProvinces] = React.useState([]);
  const [entities, setEntityTypeList] = React.useState([]);

  // Validation
  const [errors, setErrors] = React.useState();

  // Errors when loading already existing entity
  const [loadErrors, setLoadErrors] = React.useState("");

  // While loading coop data from ID
  const [loadingCoopData, setLoadingCoopData] = React.useState(false);

  // Gets id from URL
  const { id } = useParams();

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
        coopResults.addresses[0].formatted
          ? coopResults.addresses[0].formatted
          : ""
      );
      setCity(
        coopResults.addresses[0].locality.name
          ? coopResults.addresses[0].locality.name
          : ""
      );
      setState(
        coopResults.addresses[0].locality.state.code
          ? coopResults.addresses[0].locality.state.code
          : ""
      );
      setZip(
        coopResults.addresses[0].locality.postal_code
          ? coopResults.addresses[0].locality.postal_code
          : ""
      );
      setCountry(
        coopResults.addresses[0].locality.state.country.code
          ? coopResults.addresses[0].locality.state.country.code
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
      setReqReason("update");
    } catch (error) {
      console.error(error);
      setLoadErrors(`Error: ${error.message}`);
    } finally {
      setLoadingCoopData(false);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

    console.log("form submitted!");
    console.log(coopName);

    let formData = {
      coop_name: coopName,
      street: street,
      address_public: addressPublic,
      city: city,
      state: state,
      zip: zip,
      county: county,
      country: country,
      websites: websites,
      contact_name: contactName,
      contact_name_public: contactNamePublic,
      contact_email: contactEmail,
      contact_email_public: contactEmailPublic,
      contact_phone: contactPhone,
      contact_phone_public: contactPhonePublic,
      entity_types: entityTypes.join(", "),
      scope: scope,
      tags: tags,
      desc_english: descEng,
      desc_other: descOther,
      req_reason: reqReason,
      id: id,
    };

    CoopService.saveToGoogleSheet(
      formData,
      (errors) => {
        //setButtonDisabled(false);
        setErrors(errors);
      },
      function (data) {
        const result = data;
        window.scrollTo(0, 0);

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

    if (id) {
      fetchCoopForUpdate();
    }
  }, []);

  return (
    <div className="directory-form">
      <h1 className="form__title">Directory Form</h1>
      <h2 className="form__desc">
        Use this form to add or request the update of a solidarity entity or
        cooperative. We'll contact you to confirm the information
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
          noValidate
        >
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
              <div className="form-group col-md-6 col-lg-6">
                <DropDownInput
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
                  name={"desc_english"}
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
            </div>
            <div className="form-group form-row justify-content-center">
              <input
                className="submit col-sm-10 col-md-8 col-lg-6"
                type="submit"
                value="SEND ADDITION/UPDATE"
              />
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
