import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { FormGroup } from 'react-bootstrap';

import Input from './Input'
import Button from './Button'

const { REACT_APP_PROXY } = process.env;

const ChangePassword = () => {
  const [old_password, setOldPassword] = useState("")
  const [new_password, setNewPassword] = useState("")
  const [confirm_new_password, setConfirmNewPassword] = useState("")
  const [redirect] = useState(false)

  const [errors, setErrors] = useState()

  const handleFormSubmit = (e) => {
    e.preventDefault()

    if (new_password !== confirm_new_password) {
      setErrors({
        "new_password": ["New passwords do not match"],
        "confirm_new_password": ["New passwords do not match"],
      })
      return
    }

    fetch(REACT_APP_PROXY + '/change_password', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({old_password, new_password})
    }).then(resp => resp.json())
    .then(jsob => {
      if(!jsob.ok){
        console.log(jsob)
        setErrors(jsob)
      }
      if(jsob.token){
        console.log(jsob)
        setErrors({"detail": "got token"})
        // sessionStorage.setItem('token', jsob.token)
        // setRedirect(true)
      }
    })
  }

  const handleChangeWith = (cont) => {
    return (e) => {
      setErrors({})
      cont(e.target.value)
    }
  }

  return(
    <div className="login-form">
      {redirect && <Redirect to="/" />}
      <h1 className="form__title">Change Password</h1>
      <h2 className="form__desc">
        Please submit your current and desired passwords.
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
              type={"password"}
              title={"Current password"}
              name={"old_password"}
              value={old_password}
              placeholder={"Current password"}
              handleChange={handleChangeWith(setOldPassword)}
              errors={errors}
            />
          </div>
          <div className="form-group col-md-8">
            <Input
              className={"required"}
              type={"password"}
              title={"New Password"}
              name={"new_password"}
              value={new_password}
              placeholder={"New password"}
              handleChange={handleChangeWith(setNewPassword)}
              errors={errors}
            />
          </div>
          <div className="form-group col-md-8">
            <Input
              className={"required"}
              type={"password"}
              title={"Confirm New Password"}
              name={"confirm_new_password"}
              value={confirm_new_password}
              placeholder={"New password"}
              handleChange={handleChangeWith(setConfirmNewPassword)}
              errors={errors}
            />
          </div>
          {errors?.detail && (
            <div className="form__error-message">
              {errors.detail}
            </div>
          )}
          <div className="form-group col-md-6" align="center">
            <Button buttonType={"primary"} type={"submit"} title={"Change Password"} />
          </div>
        </FormGroup>
      </form>
    </div>
  )
}

export default ChangePassword
