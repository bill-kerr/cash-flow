import { useEffect } from 'react';
import { useTypedDispatch, useTypedSelector, Dispatch } from '../store';
import { onAuthStateChanged } from '../apis/auth';
import { authStateChange } from '../store/auth/actions';
import { setExpectSignIn } from '../utils/expectSignIn';

const setAuthStateListener = (dispatch: Dispatch) => {
  return onAuthStateChanged((user) => {
    if (!user) {
      setExpectSignIn(false);
    } else {
      setExpectSignIn(true);
    }

    dispatch(authStateChange(user));
  });
};

export const useAuthStateListener = () => {
  const dispatch = useTypedDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  useEffect(() => setAuthStateListener(dispatch), [dispatch]);
  return user;
};
