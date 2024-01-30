import React, { useState } from "react";
import Button from "../components/Button";
import TextAreaInput from "../components/TextAreaInput";

const { REACT_APP_PROXY } = process.env;

const RejectForm = (props) => {
    const [coopRejected, setCoopRejected] = React.useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [approved, setApproved] = React.useState(false);
    const [errors, setErrors, getErrors] = React.useState();
    const [loadErrors, setLoadErrors] = React.useState("");

    const rejRequest = async () => {
        await fetch(REACT_APP_PROXY + `/coops/${props.id}/`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "PATCH",    
            body: JSON.stringify({
                approved: approved,
                reject_reason: rejectReason
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw Error("Server request failed.");
            }
            return response.json();
        })
        .then((data) => {
            props.setCoopRejectComplete(true);
        }).catch((error) => {
            console.error(error);
            setLoadErrors(`Error: ${error.message}`);
        });
    }

    const submitRejection = (e) => {
        e.preventDefault();
        if(rejectReason === "") {
            setErrors({"reject_reason":["This field may not be blank."]});
        } else {
            rejRequest();
        }
    };

    const rejectCoop = (e) => {
        e.preventDefault();
        setCoopRejected(true);
    };

    return (
        <>
        {coopRejected ? 
            <>
            <div className="form-group col-md-12">
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
            {loadErrors && (
                <strong className="form__error-message">
                {JSON.stringify(loadErrors)}
                </strong>
            )}
            </>
        : 
            <Button action={rejectCoop} type={"secondary"} title={"Reject"} />
        }
        </>
    );
};

export default RejectForm;
