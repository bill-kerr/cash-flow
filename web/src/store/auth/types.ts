export interface User {
  displayName: string;
  id: string | null;
  email: string | null;
  photoUrl: string;
  token: string | null;
  isAnonymous: boolean;
}

export interface AuthState {
  user: User | null;
}

export type UserData = User | null;

export const AUTH_STATE_CHANGED = 'Auth:StateChanged';
export const SIGN_IN_START = 'Auth:SignInStart';
export const SIGN_IN_COMPLETE = 'Auth:SignInComplete';
export const SIGN_OUT_START = 'Auth:SignOutStart';
export const SIGN_OUT_COMPLETE = 'Auth:SignOutComplete';

export interface IAuthStateChangedAction {
  type: typeof AUTH_STATE_CHANGED;
  user: User | null;
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
