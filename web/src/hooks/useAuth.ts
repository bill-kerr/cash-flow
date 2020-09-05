import { useEffect } from 'react';
import { useTypedSelector, useTypedDispatch } from '../store';
import { onAuthStateChanged, getIdToken } from '../apis/auth';
import { SIGNED_IN } from '../store/auth/types';

export const useAuth = () => {
  const dispatch = useTypedDispatch();
  useEffect(() => {
    onAuthStateChanged(async (newUser) => {
      if (newUser) {
        const token = await getIdToken();
        dispatch({ type: SIGNED_IN, user: { ...newUser, token } });
      }
    });
  }, [dispatch]);

  const user = useTypedSelector((state) => state.auth.user);
  return user;
};
