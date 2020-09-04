import { SIGN_IN, SIGN_OUT, AuthActionTypes, User } from './types';

export const signIn = (user: User): AuthActionTypes => {
  return {
    type: SIGN_IN,
    payload: user,
  };
};

export const signOut = (user: User): AuthActionTypes => {
  return {
    type: SIGN_OUT,
    payload: user,
  };
};
