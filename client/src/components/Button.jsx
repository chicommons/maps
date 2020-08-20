import React from "react";

const Button = (props) => {
  return (
    <button
      disabled={props.disabled}
      style={props.style}
      className={
        props.type === "primary" ? "btn btn-primary" : "btn btn-secondary"
      }
      onClick={props.action}
    >
      {props.title}
    </button>
  );
};

export default Button;
