import {
  SIGN_OUT_START,
  SIGN_IN_START,
  IAuthStateChangedAction,
  User,
  AUTH_STATE_CHANGED,
  ISignInCompleteAction,
  SIGN_IN_COMPLETE,
  SIGN_OUT_COMPLETE,
  ISignOutCompleteAction,
} from './types';
import { ThunkAction } from 'redux-thunk';
import { signInWithGoogle, authSignOut, getIdToken } from '../../apis/auth';
import { Dispatch, RootState } from '..';
import { ActionCreator } from 'redux';

export const signIn: ActionCreator<ThunkAction<
  Promise<ISignInCompleteAction>,
  RootState,
  null,
  ISignInCompleteAction
>> = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: SIGN_IN_START });
    await signInWithGoogle();
    return dispatch({ type: SIGN_IN_COMPLETE });
  };
};

export const signOut: ActionCreator<ThunkAction<
  Promise<ISignOutCompleteAction>,
  RootState,
  null,
  ISignInCompleteAction
>> = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: SIGN_OUT_START });
    await authSignOut();
    return dispatch({ type: SIGN_OUT_COMPLETE });
  };
};

export const authStateChange: ActionCreator<ThunkAction<
  Promise<IAuthStateChangedAction>,
  RootState,
  null,
  IAuthStateChangedAction
>> = (user: User) => {
  return async (dispatch: Dispatch) => {
    const token = await getIdToken();
    return dispatch({ type: AUTH_STATE_CHANGED, user: { ...user, token } });
  };
};
