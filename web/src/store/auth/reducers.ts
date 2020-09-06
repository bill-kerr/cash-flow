import { AuthState, AuthActionTypes, AUTH_STATE_CHANGED } from './types';
import { fallbackUser } from '../../types/fallbackUser';

const initialState: AuthState = { user: fallbackUser };

export const authReducer = (state = initialState, action: AuthActionTypes) => {
  switch (action.type) {
    case AUTH_STATE_CHANGED:
      return { ...state, user: action.user };
    default:
      return state;
  }
};
