import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PersonFormContainer from "../../containers/PersonFormContainer";
import { DEFAULT_COUNTRY_CODE } from "../../utils/constants";
import { useAlert } from "../../components/AlertProvider";
import PersonService from "../../services/PersonService";

const { REACT_APP_PROXY } = process.env;

const EditPerson = (props) => {
  const [person, setPerson] = useState(props.person);
  const { id } = useParams();
  const [open, close] = useAlert();

  useEffect(() => {
    if (person == null) {
      PersonService.getById(id, setPerson);
    }
  }, [props]);

  if (person) {
    return (
    <>
    <h5>Edit Person Info</h5> 
    <PersonFormContainer person={person} />
    </>
    ); 
  } else {
    return (<></>);
  } 
};

export default EditPerson;
