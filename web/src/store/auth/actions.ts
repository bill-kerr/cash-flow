import { SIGN_IN, SIGN_OUT, AuthActionTypes, User } from './types';

export const signIn = (user: User): AuthActionTypes => ({ type: SIGN_IN, user });
export const signOut = (): AuthActionTypes => ({ type: SIGN_OUT });
