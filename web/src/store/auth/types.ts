export interface User {
  id: string;
  displayName: string;
  email: string;
  photoUrl: string;
}

export interface AuthState {
  user: User;
}

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

interface SendSignInAction {
  type: typeof SIGN_IN;
  payload: User;
}

interface SendSignOutAction {
  type: typeof SIGN_OUT;
  payload: User;
}

export type AuthActionTypes = SendSignInAction | SendSignOutAction;
