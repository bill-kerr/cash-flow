import cashFlow from '../apis/cashFlow';

import {
  SIGN_IN,
  FETCH_OCCURRENCES
} from './types';

export const signIn = user => {
  return { type: SIGN_IN, payload: user };
};

export const fetchOccurrences = () => async dispatch => {
  const response = await cashFlow.get('/occurrences');

  dispatch({ type: FETCH_OCCURRENCES, payload: response.data });
};