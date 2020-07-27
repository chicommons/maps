import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { PencilSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Button from "../../components/Button";

const { REACT_APP_PROXY } = process.env;

const ListPeople = (props) => {
  const [coop, setCoop] = useState(props?.location?.state?.coop);
  let { id } = useParams();
  let [people, setPeople] = useState(null);
  const history = useHistory();

  const addPeople = () => {
    const result = coop;
    history.push({
      pathname: "/" + id + "/people",
      state: { coop: result },
    });
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (coop == null) {
      fetch(REACT_APP_PROXY + "/people?coop=" + id)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setPeople(data);
        });
    }
  }, [props]);

  return (
    <div>
      <ListGroup variant="flush">
        {people?.map((item) => (
          <ListGroupItem key={item.id} value={item.name}>
            {item.first_name} {item.last_name}
            <span className="float-right">
              <Link to={"/person/" + item.id + "/edit"}>
                <PencilSquare color="royalblue" size={26} />
              </Link>
            </span>
          </ListGroupItem>
        ))}
      </ListGroup>
      <Button
        action={addPeople}
        type={"primary"}
        title={"Add People"}
        style={buttonStyle}
      />
    </div>
  );
};

const buttonStyle = {
  margin: "10px 10px 10px 10px",
};

export default ListPeople;
