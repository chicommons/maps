import React from "react";

import "../App.css";

const Button = (props) => {
  return (
    <button
      disabled={props.disabled}
      style={props.style}
      className={
        props.buttonType === "primary" ? "btn btn-primary buttonStyle col-sm-10 col-md-8 col-lg-6" : "btn btn-secondary buttonStyle col-sm-10 col-md-8 col-lg-6"
      }
      onClick={props.action}
      type={props.type}
    >
      {props.title}
    </button>
  );
};

export default Button;
