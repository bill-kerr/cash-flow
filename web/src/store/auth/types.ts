import { Action } from 'redux';

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

export const START_SIGN_IN = 'Auth:StartSignIn';
export const SIGNED_IN = 'Auth:SignedIn';
export const START_SIGN_OUT = 'Auth:StartSignOut';
export const SIGNED_OUT = 'Auth:SignedOut';

// interface SendSignInAction {
//   type: typeof SIGN_IN;
//   payload: User;
// }

// interface SendSignOutAction {
//   type: typeof SIGN_OUT;
// }

export interface IStartSignInAction extends Action<typeof START_SIGN_IN> {}
export interface ISignedInAction extends Action<typeof SIGNED_IN> {
  user: User;
}
export interface IStartSignOutAction extends Action<typeof START_SIGN_OUT> {}
export interface ISignedOutAction extends Action<typeof SIGNED_OUT> {}
export type AuthActionTypes = IStartSignInAction | ISignedInAction | ISignedOutAction | IStartSignOutAction;
