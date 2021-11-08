import React from "react";
import Button from "../components/Button";

import { useHistory } from "react-router-dom";

const CancelButton = (props) => {
    const goBack = (e) => {
        e.preventDefault();

        if (props.id) {
            history.goBack();
        } else {
            history.push('/');
        }
    };

    const history = useHistory();

    return (
        <Button action={goBack} type={"secondary"} title={"Cancel"} />
    );
};

export default CancelButton;
