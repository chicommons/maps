import React, { useState } from 'react';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { useCookies } from "react-cookie";

import Input from './Input'
import Button from './Button'

const { REACT_APP_PROXY } = process.env;

const ResetPassword = () => {
  const [email, setEmail] = useState("")
  const [cookies] = useCookies(["csrftoken"]);

  const [response, setResponse] = useState({})

  const handleFormSubmit = (e) => {
    e.preventDefault()

    fetch(REACT_APP_PROXY + '/api/v1/password_reset/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.csrftoken,
      },
      body: JSON.stringify({ email })
    })
    .then(resp => resp.json())
    .then(json => setResponse(json))
  }

  return(
    <div className="reset-password-form">
      <h1 className="form__title">Reset Password</h1>
      <h2 className="form__desc">
        Please enter your email address to have a reset-password email sent.
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
          <div className="form-group col-md-8">{
            response?.message ?
              <>
                <FormLabel>Email address</FormLabel>
                <FormControl type={"input"} value={email} disabled />
              </>
              :
              <Input
                className={"required"}
                type={"text"}
                title={"Email address"}
                name={"email"}
                value={email}
                placeholder={"Email address"}
                handleChange={(e) => {
                  setResponse({ ...response, error: "" })
                  setEmail(e.target.value)
                }}
                errors={response?.error ? [response.error] : []}
              />
          }</div>
          <div className="form-group col-md-6" align="center">{
            response?.message ?
              response.message
              :
              <Button buttonType={"primary"} type={"submit"} title={"Reset Password"} />
          }</div>
          <div className="form__error-message col-md-8">{response?.error ?? ''}</div>
        </FormGroup>
      </form>
    </div>
  )
}

export default ResetPassword
