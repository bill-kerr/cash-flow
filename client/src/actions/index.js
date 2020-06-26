import cashFlow from '../apis/cashFlow';

import {
  SIGN_IN,
  FETCH_OCCURRENCES
} from './types';

export const signIn = user => {
  return { type: SIGN_IN, payload: user };
};

export const fetchOccurrences = (token, startDate, endDate) => async dispatch => {
  const response = await cashFlow.get('/occurrences', {
    headers: {
      'Authorization': `Bearer ${ token }`
    },
    params: { startDate, endDate }
  });

  dispatch({ type: FETCH_OCCURRENCES, payload: response.data.data });
};