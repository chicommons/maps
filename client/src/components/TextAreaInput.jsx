import React from "react";
import { FormControl, FormLabel } from "react-bootstrap";
import _ from "lodash";

const TextAreaInput = (props) => {
  const errorsArr = _.get(props.errors, props.name);

  return (
    <div className="form-group">
      <FormLabel className={props.className}>{props.title}</FormLabel>
      <FormControl
        isInvalid={props.errors && errorsArr}
        type={props.type}
        as={props.as}
        rows={3}
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

export default TextAreaInput;
