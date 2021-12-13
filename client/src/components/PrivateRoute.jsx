import React, { Component }  from 'react';
import { Redirect } from 'react-router';
import { Route } from 'react-router-dom';

function PrivateRoute ({component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

export default PrivateRoute;

