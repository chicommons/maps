import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { PencilSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const { REACT_APP_PROXY } = process.env;

const ListPeople = (props) => {
  const [coop, setCoop] = useState(props?.location?.state?.coop);
  const { coop_id } = useParams();
  let [people, setPeople] = useState(null);

  useEffect(() => {
    if (coop == null) {
      fetch(REACT_APP_PROXY + "/people?coop=" + coop_id)
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
              <Link to={"/edit/" + item.id}>
                <PencilSquare color="royalblue" size={26} />
              </Link>
            </span>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default ListPeople;
