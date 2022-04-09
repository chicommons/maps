import React, { useState } from 'react';
import { FormGroup } from 'react-bootstrap';

import Input from './Input'
import Button from './Button'

const { REACT_APP_PROXY } = process.env;

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleFormSubmit = (e) => {
    e.preventDefault()
    fetch(REACT_APP_PROXY + '/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    }).then(resp => resp.json())
    .then(jsob => {
      if(jsob.token){
        sessionStorage.setItem('token', jsob.token)
      }
    })
    //TODO:: Only set Session token if login is successful
    //TODO:: Add redirect after login
    //TODO:: Error Handling
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
        <Button action={handleFormSubmit} type={"primary"} title={"Login"} />
      </FormGroup>
      {
        // <span className="center" >No account? <a href="/signup">Sign up</a> now.</span>
      }
    </div>
  )
}

export default Login
