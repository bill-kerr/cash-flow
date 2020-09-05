import { AuthState, AuthActionTypes, SIGN_IN, SIGN_OUT } from './types';
import { fallbackUser } from '../../types/fallbackUser';

const initialState: AuthState = { user: fallbackUser };

export const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, user: action.payload };
    case SIGN_OUT:
      return { ...state, user: fallbackUser };
    default:
      return state;
  }
};
