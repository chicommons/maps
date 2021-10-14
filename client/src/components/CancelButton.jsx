import React from "react";
import Button from "../components/Button";

import { useHistory } from "react-router-dom";

const CancelButton = (props) => {
    const goBack = () => {
        history.goBack();
    };

    const history = useHistory();

    return (
        <Button action={goBack} type={"secondary"} title={"Cancel"} />
    );
};

export default CancelButton;
