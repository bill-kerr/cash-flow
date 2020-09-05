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

export const SIGN_IN = 'Auth:SignIn';
export const SIGN_OUT = 'Auth:SignOut';

// interface SendSignInAction {
//   type: typeof SIGN_IN;
//   payload: User;
// }

// interface SendSignOutAction {
//   type: typeof SIGN_OUT;
// }

export interface ISignInAction extends Action<typeof SIGN_IN> {
  user: User;
}
export interface ISignOutAction extends Action<typeof SIGN_OUT> {}

export type AuthActionTypes = ISignInAction | ISignOutAction;
