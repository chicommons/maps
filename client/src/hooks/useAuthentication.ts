import { useEffect } from 'react';
import { Storage } from '@/utils';
import { useAuthenticationState, useAuthenticationDispatch } from '@/context';

interface ReturnObject {
  isAuthenticated: boolean;
}

const useAuthentication = (): ReturnObject => {
  const authenticationState = useAuthenticationState();
  const updateAuthenticationState = useAuthenticationDispatch();

  useEffect(() => {
    const access_token = Storage.getItem('mlf_cfl.access_token');
    updateAuthenticationState({
      type: 'field',
      fieldName: 'isAuthenticated',
      payload: !!access_token,
    });
  }, [updateAuthenticationState]);

  const isAuthenticated = authenticationState.isAuthenticated;

  return {
    isAuthenticated,
  };
};

export default useAuthentication;
