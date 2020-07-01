import {
  SIGN_IN
} from '../types';

export const signIn = user => {
  return { type: SIGN_IN, payload: user };
};