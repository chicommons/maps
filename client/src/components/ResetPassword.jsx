import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { FormGroup } from 'react-bootstrap';
import { useCookies } from "react-cookie";

import Input from './Input'
import Button from './Button'

const { REACT_APP_PROXY } = process.env;

const ResetPassword = () => {
  const [username, setUsername] = useState("")
  const [redirect, setRedirect] = useState(false)
  const [cookies, setCookie] = useCookies(["csrftoken"]);

  const [errors, setErrors] = useState()

  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log(cookies);
    const csrftoken = cookies;
    console.log("token:" + csrftoken);
    fetch(REACT_APP_PROXY + '/reset_password', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({username})
    }).then(resp => resp.json())
    .then(jsob => {
      if(!jsob.ok){
        console.log(jsob)
        setErrors(jsob)
      }
      if(jsob.token){
        sessionStorage.setItem('token', jsob.token)
        setRedirect(true)
      }
    })
  }

  return(
    <div className="reset-password-form">
      {redirect && <Redirect to="/" />}
      <h1 className="form__title">Reset Password</h1>
      <h2 className="form__desc">
        Please enter your your username to have a reset-password email sent.
      </h2>
      <h2 className="form__desc">
        <span style={{ color: "red" }}>*</span> = required
      </h2>
      <form
      onSubmit={handleFormSubmit}
      className="container-fluid"
      id="reset-password-form"
      noValidate>
        <FormGroup>
          <div className="form-group col-md-8">
            <Input
              className={"required"}
              type={"text"}
              title={"Username"}
              name={"username"}
              value={username}
              placeholder={"Username"}
              handleChange={(e) => setUsername(e.target.value)}
              errors={errors}
            />
          </div>
          <div className="form-group col-md-6" align="center">
            <Button buttonType={"primary"} type={"submit"} title={"Reset Password"} />
          </div>
        </FormGroup>
      </form>
    </div>
  )
}

export default ResetPassword
