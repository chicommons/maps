import React, { useReducer, useContext, createContext } from 'react';
import { useEffect } from 'react';

const initialState = {
  isAuthenticated: false,
};

const AuthenticationStateContext = createContext(undefined);
const AuthenticationDispatchContext = createContext(undefined);

function authenticationReducer(state, action) {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AuthenticationProvider({ children }) {
  const [authenticationState, setAuthenticationState] = useReducer(
    authenticationReducer,
    initialState
  );

  return (
    <AuthenticationStateContext.Provider value={authenticationState}>
      <AuthenticationDispatchContext.Provider value={setAuthenticationState}>
        {children}
      </AuthenticationDispatchContext.Provider>
    </AuthenticationStateContext.Provider>
  );
}

function useAuthenticationState() {
  const context = useContext(AuthenticationStateContext);
  if (context === undefined) {
    throw new Error('useAuthenticationState must be used within a AuthenticationProvider');
  }
  return context;
}

function useAuthenticationDispatch() {
  const context = useContext(AuthenticationDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthenticationDispatch must be used within a AuthenticationProvider');
  }
  return context;
}
export { useAuthenticationState, useAuthenticationDispatch, AuthenticationProvider };
