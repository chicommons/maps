import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { FormGroup } from 'react-bootstrap';

import Input from './Input'
import Button from './Button'
import { createModuleResolutionCache } from 'typescript';

const { REACT_APP_PROXY } = process.env;

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [redirect, setRedirect] = useState(false)

  const [errors, setErrors] = useState()

  const handleFormSubmit = (e) => {
    e.preventDefault()
    fetch(REACT_APP_PROXY + '/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
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
    <div className="login-form">
      <h1 className="form__title">Login</h1>
      <h2 className="form__desc">
        Please login with your username and password.
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
              title={"Username"}
              name={"username"}
              value={username}
              placeholder={"Username"}
              handleChange={(e) => setUsername(e.target.value)}
              errors={errors}
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
              errors={errors}
            />
          </div>
          {errors && errors.detail && (
            <div className="form__error-message">
              {errors.detail}
            </div>
          )}
          <div className="form-group col-md-6" align="center">
            <Button buttonType={"primary"} type={"submit"} title={"Login"} />
          </div>
        </FormGroup>
      </form>
      {redirect ? <Redirect to="/" /> : null}
    </div>
  )
}

export default Login
