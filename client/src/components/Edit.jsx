import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";

import FormContainer from "../containers/FormContainer";
import ListPeople from "../components/people/ListPeople";
import { DEFAULT_COUNTRY_CODE } from "../utils/constants";
import CoopService from '../services/CoopService';

const { REACT_APP_PROXY } = process.env;

const Edit = (props) => {
  const { id } = useParams();
  const [key, setKey] = useState("home");
  const [coop, setCoop] = useState(null);

  useEffect(() => {
    if (coop == null) {
      CoopService.getById(id, setCoop); 
    }
  }, [props]);

  if (coop == null) {
    return <></>;
  }
  return (
    <div className="container">
      <h1>{coop.name}</h1>

      <Tabs id="controlled-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
        <Tab eventKey="home" title="Home">
          <FormContainer coop={coop} />
        </Tab>
        <Tab eventKey="people" title="People">
          <ListPeople coop={coop} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Edit;
