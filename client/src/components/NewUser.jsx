import React, { useState } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Input from './Input'
import Button from './Button'

const { REACT_APP_PROXY } = process.env;

const NewUser = () => {


  //using snake case here when we use destructuring to pass the info to the database our object will match what the database expects.
  const [first_name, setFirstName] = useState("")
  const [last_name, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passConfirm, setPassConfirm] = useState("")
  const [email, setEmail] = useState("")

  const [errors, setErrors] = useState()
  const [redirect, setRedirect] = useState(false)

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (password != passConfirm) {
      //handle password doesn't match password confirm on submit
      setErrors({passConfirm: ["Must match password"]})
      return
    }
    fetch(REACT_APP_PROXY + '/users/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Token ${sessionStorage.getItem('token')}`},
      body: JSON.stringify({first_name, last_name, username, password, email})
    }).then((response) => {
      if (response.ok) {
        sessionStorage.setItem('token', response['Refresh-Token'])
        setRedirect(true)
      } else {
        setErrors(response)
        console.log(response)
      }
    })
  }

  return(
    <div className="login-form">
      <h1 className="form__title">Sign Up</h1>
      <h2 className="form__desc">
        Please choose a username and password.
      </h2>
      <h2 className="form__desc">
        <span style={{ color: "red" }}>*</span> = required
      </h2>
      <form
      onSubmit={handleFormSubmit}
      className="container-fluid"
      id="login-form"
      noValidate>
        <FormGroup>
          <div className="form-group col-md-8">
            <Input
              className={"required"}
              type={"text"}
              title={"First Name"}
              name={"first_name"}
              value={first_name}
              placeholder={"First Name"}
              handleChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group col-md-8">
            <Input
              className={"required"}
              type={"text"}
              title={"Last Name"}
              name={"last_name"}
              value={last_name}
              placeholder={"Last Name"}
              handleChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group col-md-8">
            <Input
              className={"required"}
              type={"text"}
              title={"Username"}
              name={"username"}
              value={username}
              placeholder={"Username"}
              handleChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group col-md-8">
            <Input
              className={"required"}
              type={"password"}
              title={"Password"}
              name={"password"}
              value={password}
              placeholder={"Password"}
              handleChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group col-md-8">
            <Input
              className={"required"}
              type={"password"}
              title={"Confirm Password"}
              name={"passConfirm"}
              value={passConfirm}
              placeholder={"Confirm Password"}
              handleChange={(e) => setPassConfirm(e.target.value)}
            />
          </div>
          <div className="form-group col-md-8">
            <Input
              className={"required"}
              type={"text"}
              title={"Email"}
              name={"email"}
              value={email}
              placeholder={"Email"}
              handleChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group col-md-6" align="center">
            <Button buttonType={"primary"} type={"submit"} title={"Sign Up"} />
          </div>
        </FormGroup>
    </form>
    {redirect ? <Redirect to="/" /> : null}
    </div>
  )
}

export default NewUser
