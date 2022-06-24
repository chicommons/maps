import React, { useState } from "react";
import Button from "../components/Button";
import TextAreaInput from "../components/TextAreaInput";

import { useHistory } from "react-router-dom";

const RejectButton = (props) => {
    const [coopRejected, setCoopRejected] = React.useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [errors, setErrors, getErrors] = React.useState();


    const submitRejection = (e) => {
        e.preventDefault();
        console.log('Rejected!');
        console.log(rejectReason);
        if(rejectReason === "") {
            setErrors({"reject_reason":["This field may not be blank."]});
        }

        // if (props.id) {
        //     history.goBack();
        // } else {
        //     history.push('/');
        // }
    };

    const rejectCoop = (e) => {
        e.preventDefault();
        setCoopRejected(true);
        console.log('yeah!!!');
    };

    const history = useHistory();

    return (
        <>
        {coopRejected ? 
        <>
            <div className="form-group col-md-12 col-lg-6 col-xl-4">
                <TextAreaInput
                    className={"required"}
                    type={"textarea"}
                    as={"textarea"}
                    title={"Reason for Rejection"}
                    name={"reject_reason"}
                    value={rejectReason}
                    placeholder={"Why is this coop submission being rejected?"}
                    handleChange={(e) => setRejectReason(e.target.value)}
                    errors={errors}
                />{" "}
            </div>
            <div className="form-group col-md-12" align="center">
                <Button action={submitRejection} type={"secondary"} title={"Submit Rejection"} />
            </div>
            </>
        : 
            <Button action={rejectCoop} type={"secondary"} title={"Reject"} />
        }
        </>
    );
};

export default RejectButton;
