import { useEffect } from 'react';
import { useAuthenticationState, useAuthenticationDispatch } from '../context';

const useAuthentication = () => {
  const authenticationState = useAuthenticationState();
  const updateAuthenticationState = useAuthenticationDispatch();

  useEffect(() => {
    const auth_token = sessionStorage.getItem('token');
    updateAuthenticationState({
      type: 'field',
      fieldName: 'isAuthenticated',
      payload: !!auth_token,
    });
  }, [updateAuthenticationState]);

  const isAuthenticated = authenticationState.isAuthenticated;

  return {
    isAuthenticated,
  };
};

export default useAuthentication;
