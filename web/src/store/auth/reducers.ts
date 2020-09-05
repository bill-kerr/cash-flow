import { AuthState, AuthActionTypes, SIGNED_IN, SIGNED_OUT } from './types';
import { fallbackUser } from '../../types/fallbackUser';

const initialState: AuthState = { user: fallbackUser };

export const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case SIGNED_IN:
      return { ...state, user: action.user };
    case SIGNED_OUT:
      return { ...state, user: fallbackUser };
    default:
      return state;
  }
};
