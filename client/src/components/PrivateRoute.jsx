import React, { Component }  from 'react';
import { Redirect } from 'react-router';
import { Route } from 'react-router-dom';

const PrivateRoute = ({component: WrappedComponent, authed, ...rest}) => {
  console.log("in private route, authed: " + authed);
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <WrappedComponent {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

export default PrivateRoute;

