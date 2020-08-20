import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PersonFormContainer from "../../containers/PersonFormContainer";
import { DEFAULT_COUNTRY_CODE } from "../../utils/constants";
import { useAlert } from "../../components/AlertProvider";
import CoopService from "../../services/CoopService";

const initPerson = (coop) => {
  return {
    first_name: "",
    last_name: "",
    coops: [coop],
    email: "",
    phone: "",
  };
};

const AddPerson = (props) => {
  const [coop, setCoop] = useState(props?.location?.state?.coop);
  const [person, setPerson] = useState(initPerson(coop));
  const { coop_id } = useParams();
  const [open, close] = useAlert();

  useEffect(() => {
    // when some condition is met
    const message = props?.location?.state?.message;
    if (message) open(message); // closable with the toggle, or in code via close()
    /* if (coop == null) {
      console.log("called ...");
      CoopService.getById(coop_id, function (data) {
        const coop = data;
        coop.addresses.map((address) => {
          address.country = DEFAULT_COUNTRY_CODE; // address.locality.state.country.id;
        });
        setCoop(coop);
        let personCopy = JSON.parse(JSON.stringify(person));
        personCopy.coop = coop;
        setPerson(personCopy);
      });
    } */
  }, []);

  useEffect(() => {
    if (coop == null) {
      CoopService.getById(coop_id, function (data) {
        console.log("done 2!");
        const coop = data;
        coop.addresses.map((address) => {
          address.country = DEFAULT_COUNTRY_CODE; // address.locality.state.country.id;
        });
        setCoop(coop);
        console.log("retrieved coop ...");
        console.log(coop);
        let personCopy = JSON.parse(JSON.stringify(person));
        personCopy.coops = [coop];
        setPerson(personCopy);
        console.log("person ...");
        console.log(personCopy);
      });
    }
  }, [props]);

  return (
    <>
      <h5>Add Person Info</h5>
      <PersonFormContainer person={person} />
    </>
  );
};

export default AddPerson;
