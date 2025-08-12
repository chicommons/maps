import React from "react";
import { FormControl, FormLabel } from "react-bootstrap";
import _ from "lodash";

const Input = React.forwardRef((props, ref) => {
  const errorsArr = _.get(props.errors, props.name);

  return (
    <div className="form-group">
      <FormLabel className={props.className} style={inputStyle}>
        {props.title}
      </FormLabel>
      <FormControl
        ref={ref} // Forward the ref to FormControl
        isInvalid={props.errors && errorsArr}
        type={props.type}
        id={props.name}
        data-index={props.index}
        data-parent={props.parent}
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
});
const inputStyle = {
  color: "#124E54",
};

export default Input;