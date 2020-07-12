import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PersonFormContainer from "../../containers/PersonFormContainer";
import { DEFAULT_COUNTRY_CODE } from "../../utils/constants";

const { REACT_APP_PROXY } = process.env;

const AddPerson = (props) => {
  const [coop, setCoop] = useState(props?.location?.state?.coop);
  const { id } = useParams();

  useEffect(() => {
    if (coop == null) {
      fetch(REACT_APP_PROXY + "/coops/" + id)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const coop = data;
          coop.addresses.map((address) => {
            address.country = DEFAULT_COUNTRY_CODE; // address.locality.state.country.id;
          });
          setCoop(coop);
        });
    }
    //const coop = props.coop;
    //setCoop(coop);
  }, [props]);

  return <PersonFormContainer coop={coop} />;
};

export default AddPerson;
