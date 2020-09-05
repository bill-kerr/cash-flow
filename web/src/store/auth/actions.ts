import { SIGNED_IN, ISignedInAction, START_SIGN_IN, START_SIGN_OUT, SIGNED_OUT, ISignedOutAction } from './types';
import { ThunkAction } from 'redux-thunk';
import { signInWithGoogle, authSignOut } from '../../apis/auth';
import { Dispatch, RootState } from '..';
import { ActionCreator } from 'redux';

export const signIn: ActionCreator<ThunkAction<Promise<ISignedInAction>, RootState, null, ISignedInAction>> = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: START_SIGN_IN });
    const user = await signInWithGoogle();
    return dispatch({ type: SIGNED_IN, user });
  };
};

export const signOut: ActionCreator<ThunkAction<Promise<ISignedOutAction>, RootState, null, ISignedOutAction>> = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: START_SIGN_OUT });
    await authSignOut();
    return dispatch({ type: SIGNED_OUT });
  };
};
