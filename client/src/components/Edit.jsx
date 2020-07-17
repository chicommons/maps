import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";

import FormContainer from "../containers/FormContainer";
import ListPeople from "../components/people/ListPeople";
import { DEFAULT_COUNTRY_CODE } from "../utils/constants";

const { REACT_APP_PROXY } = process.env;

const Edit = (props) => {
  const { id } = useParams();
  const [key, setKey] = useState("home");
  const [coop, setCoop] = useState(null);

  useEffect(() => {
    if (coop == null) {
      fetch(REACT_APP_PROXY + "/coops/" + id)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const coop = data;
          coop.addresses.map((address) => {
            address.country = { code: address.locality.state.country.code };
          });
          console.log("edit cop ...");
          console.log(coop);
          setCoop(data);
        });
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
