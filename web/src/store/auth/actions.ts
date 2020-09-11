import {
  SIGN_OUT_START,
  SIGN_IN_START,
  IAuthStateChangedAction,
  AUTH_STATE_CHANGED,
  ISignInCompleteAction,
  SIGN_IN_COMPLETE,
  SIGN_OUT_COMPLETE,
  ISignOutCompleteAction,
  User,
} from './types';
import { signInWithGoogle, authSignOut, getIdToken } from '../../apis/auth';
import { AsyncActionCreator } from '..';

export const googleSignIn: AsyncActionCreator<ISignInCompleteAction> = () => {
  return async (dispatch) => {
    dispatch({ type: SIGN_IN_START });
    await signInWithGoogle();
    return dispatch({ type: SIGN_IN_COMPLETE });
  };
};

export const signOut: AsyncActionCreator<ISignOutCompleteAction> = () => {
  return async (dispatch) => {
    dispatch({ type: SIGN_OUT_START });
    await authSignOut();
    return dispatch({ type: SIGN_OUT_COMPLETE });
  };
};

export const authStateChange: AsyncActionCreator<IAuthStateChangedAction, User | null> = (user) => {
  return async (dispatch) => {
    const newUser = user ? { ...user, token: await getIdToken() } : null;
    return dispatch({ type: AUTH_STATE_CHANGED, user: newUser });
  };
};
