import React from "react";
import { FormControl, FormLabel } from "react-bootstrap";

const Input = (props) => {
  const errorKey = ("props.errors." + props.name).replaceAll(".", "\?\.");
  const errorsArr = eval(errorKey);

  return (
    <div className="form-group">
      <FormLabel>{props.title}</FormLabel>
      <FormControl
        isInvalid={props.errors && errorsArr}
        type={props.type}
        id={props.name}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.handleChange}
      />

      {errorsArr && (
        <FormControl.Feedback type="invalid">
          {errorsArr.map((error, index) => (
            <div
              key={`field-error-${props.name}-${index}`}
              className="fieldError"
            >
              {error}
            </div>
          ))}
        </FormControl.Feedback>
      )}
    </div>
  );
};

export default Input;
