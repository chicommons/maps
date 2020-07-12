import React, { useEffect, useState } from "react";

import FormContainer from "../containers/FormContainer";
import { Tabs, Tab } from "react-bootstrap";

const Edit = (props) => {
  const [key, setKey] = useState("home");
  const [coop, setCoop] = useState(null);

  useEffect(() => {
    const coop = props.coop;
    setCoop(coop);
  }, [props]);

  return (
    <div className="container">
      <h1>Coop Name</h1>

      <Tabs id="controlled-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
        <Tab eventKey="home" title="Home">
          <FormContainer coop={this.state.coop} />
        </Tab>
        <Tab eventKey="people" title="People">
          <p>this is people tab</p>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Edit;
