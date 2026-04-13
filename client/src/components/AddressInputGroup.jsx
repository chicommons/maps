import React from "react";
import Country from "./Country.jsx";
import Province from "./Province.jsx";
import DropDownInput from "./DropDownInput.jsx";
import Input from "./Input.jsx";

const AddressInputGroup = ({
  street,
  city,
  state,
  zip,
  county,
  country,
  addressPublic,
  index,
  setStreet,
  setCity,
  setState,
  setZip,
  setCounty,
  setCountry,
  setAddressPublic,
  errors,
  provinces,
  countries,
}) => {
  return (
    <>
      <div className="form-group col-md-6 col-lg-3 col-xl-3">
        <Input
          className={"required"}
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
          className={"required"}
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
          className={"required"}
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
          className={"required"}
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
          className={"required"}
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
          className={"required"}
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
            { id: "yes-id", name: "Yes" },
            { id: "no-id", name: "No" },
          ]}
        />
      </div>
    </>
  );
};

export default AddressInputGroup;
