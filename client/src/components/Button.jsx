import React from "react";

import "../App.css";

const Button = (props) => {
  return (
    <button
      disabled={props.disabled}
      style={props.style}
      className={
        props.buttonType === "primary" ? "btn btn-primary btn-block buttonStyle" : "btn btn-secondary btn-block buttonStyle"
      }
      onClick={props.action}
      type={props.type}
    >
      {props.title}
    </button>
  );
};

export default Button;
