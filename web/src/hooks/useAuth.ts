import { useEffect } from 'react';
import { useTypedSelector, useTypedDispatch } from '../store';
import { onAuthStateChanged, getIdToken } from '../apis/auth';
import { SIGN_IN } from '../store/auth/types';

export const useAuth = () => {
  const dispatch = useTypedDispatch();
  useEffect(() => {
    onAuthStateChanged(async (newUser) => {
      if (newUser) {
        const token = await getIdToken();
        dispatch({ type: SIGN_IN, user: { ...newUser, token } });
      }
    });
  }, [dispatch]);

  const user = useTypedSelector((state) => state.auth.user);
  return user;
};
