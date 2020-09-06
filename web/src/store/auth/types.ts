export interface User {
  id: string;
  displayName: string;
  email: string;
  photoUrl: string;
  token: string | null;
}

export interface AuthState {
  user: User;
}

export const AUTH_STATE_CHANGED = 'Auth:StateChanged';
export const SIGN_IN_START = 'Auth:SignInStart';
export const SIGN_IN_COMPLETE = 'Auth:SignInComplete';
export const SIGN_OUT_START = 'Auth:SignOutStart';
export const SIGN_OUT_COMPLETE = 'Auth:SignOutComplete';

export interface IAuthStateChangedAction {
  type: typeof AUTH_STATE_CHANGED;
  user: User;
}

export interface ISignInStartAction {
  type: typeof SIGN_IN_START;
}

export interface ISignInCompleteAction {
  type: typeof SIGN_IN_COMPLETE;
}

export interface ISignOutStartAction {
  type: typeof SIGN_OUT_START;
}

export interface ISignOutCompleteAction {
  type: typeof SIGN_OUT_COMPLETE;
}

export type AuthActionTypes =
  | IAuthStateChangedAction
  | ISignInStartAction
  | ISignInCompleteAction
  | ISignOutStartAction
  | ISignOutCompleteAction;
