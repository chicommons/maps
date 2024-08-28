import { useEffect } from 'react';
import { useAuthenticationState, useAuthenticationDispatch } from '../context';

const useAuthentication = () => {
  const authenticationState = useAuthenticationState();
  const updateAuthenticationState = useAuthenticationDispatch();

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        const auth_token = event.newValue;
        console.log("auth token: " + auth_token);
        updateAuthenticationState({
          type: 'field',
          fieldName: 'isAuthenticated',
          payload: !!auth_token,
        });
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Initial check for authentication token in session storage
    const auth_token = sessionStorage.getItem('token');
    console.log("auth token: " + auth_token);
    updateAuthenticationState({
      type: 'field',
      fieldName: 'isAuthenticated',
      payload: !!auth_token,
    });

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateAuthenticationState]);

  const isAuthenticated = authenticationState.isAuthenticated;

  return {
    isAuthenticated,
  };
};

export default useAuthentication;
