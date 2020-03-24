import React from 'react';
import {FormControl, FormLabel} from 'react-bootstrap';

const Input = (props) => {
    return (  
  <div>
      <FormLabel>{props.name}</FormLabel>
      <FormControl
            type={props.type}
            id={props.name}
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.handleChange}
          />
  </div>
    )
}

export default Input;

