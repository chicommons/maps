import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import { Route } from "react-router-dom";

import FormContainer from "../containers/FormContainer";
import ListPeople from "../components/people/ListPeople";
import { DEFAULT_COUNTRY_CODE } from "../utils/constants";
import CoopService from "../services/CoopService";

const { REACT_APP_PROXY } = process.env;

const Edit = (props) => {
  const { id } = useParams();
  const [key, setKey] = useState("home");
  const [coop, setCoop] = useState(null);

  useEffect(() => {
    if (coop == null) {
      CoopService.getById(id, function (data) {
        //data.addresses.map((address) => {
        //  address.locality.state = address.locality.state.id;
        //});
        setCoop(data);
      });
    }
  }, [props]);

  if (coop == null) {
    return <></>;
  }

  return (
    <Route path="/edit/:id/:tab">
      {({ match, history }) => {
        const { tab } = match ? match.params : {};

        return (
          <>
            <h5>{coop.name}</h5>
            <Tabs
              activeKey={tab}
              onSelect={(nextTab) => history.push(`/edit/${id}/${nextTab}`)}
            >
              <Tab eventKey="home" title="Home">
                <FormContainer coop={coop} />
              </Tab>
              <Tab eventKey="people" title="People">
                <ListPeople coop={coop} />
              </Tab>
            </Tabs>
          </>
        );
      }}
    </Route>
  );
};

export default Edit;
