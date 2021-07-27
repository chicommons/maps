import React from "react";
import { Form, FormControl, FormLabel } from "react-bootstrap";
import _ from "lodash";

const DropDownInput = (props) => {
  const errorsArr = _.get(props.errors, props.name);

  return (
    <div className="form-group">
      <FormLabel className={props.className}>{props.title}</FormLabel>

      <FormControl
        isInvalid={props.errors && errorsArr}
        as={props.as}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        multiple={props.multiple && "multiple"}
      >
        {!props.multiple && (
          <option value="" disabled>
            Select
          </option>
        )}
        {props.options.map((option) => {
          return (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          );
        })}
      </FormControl>

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

export default DropDownInput;
