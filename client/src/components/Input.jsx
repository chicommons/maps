import React from 'react';
import {FormControl, FormLabel} from 'react-bootstrap';

const Input = (props) => {
    return (  
  <div className="form-group">
      <FormLabel>{props.title}</FormLabel>
      <FormControl
            isInvalid={props.errors && Boolean(props.errors[props.name])}
            type={props.type}
            id={props.name}
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.handleChange}
          />

      {props.errors && props.errors[props.name] && (
          <FormControl.Feedback type="invalid">
                 {props.errors[props.name].map((error, index) => (
                     <div key={`field-error-${props.name}-${index}`} className="fieldError">{error}</div>
                 ))} 
          </FormControl.Feedback>
      )}
  </div>
    )
}

export default Input;

