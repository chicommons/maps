import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { FormGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Input from './Input';
import Button from './Button';
import { useAuthenticationDispatch } from '../context';  // Import the dispatch hook

const { REACT_APP_PROXY } = process.env;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState();

  const dispatch = useAuthenticationDispatch();  // Get the dispatch function

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const request = {
      username: username,
      password: password
    };
    fetch(REACT_APP_PROXY + '/api/v1/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })
      .then((resp) => resp.json())
      .then((jsob) => {
        if (!jsob.ok) {
          console.log(jsob);
          setErrors(jsob);
        }
        if (jsob.access) {
          sessionStorage.setItem('token', jsob.access);
          dispatch({
            type: 'field',
            fieldName: 'isAuthenticated',
            payload: true,
          });
          setRedirect(true);
        }
      });
  };

  return (
    <div className="login-form">
      {redirect && <Redirect to="/" />}
      <h1 className="form__title">Login</h1>
      <h2 className="form__desc">
        Please login with your username and password.
      </h2>
      <h2 className="form__desc">
        <span style={{ color: 'red' }}>*</span> = required
      </h2>
      <form
        onSubmit={handleFormSubmit}
        className="container-fluid"
        id="login-form"
        noValidate
      >
        <FormGroup>
          <div className="form-group col-md-8">
            <Input
              className={'required'}
              type={'text'}
              title={'Username'}
              name={'username'}
              value={username}
              placeholder={'Username'}
              handleChange={(e) => setUsername(e.target.value)}
              errors={errors}
            />
          </div>
          <div className="form-group col-md-8">
            <Input
              className={'required'}
              type={'password'}
              title={'Password'}
              name={'password'}
              value={password}
              placeholder={'Password'}
              handleChange={(e) => setPassword(e.target.value)}
              errors={errors}
            />
          </div>
          {errors?.detail && (
            <div className="form__error-message">{errors.detail}</div>
          )}
          <div className="form-group col-md-6" align="center">
            <Button buttonType={'primary'} type={'submit'} title={'Login'} />
          </div>
          <div className="form-group col-md-6" align="center">
            Forgot password? Reset it <Link to="/reset-password">here.</Link>
          </div>
        </FormGroup>
      </form>
    </div>
  );
};

export default Login;
