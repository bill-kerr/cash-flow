import cashFlow from '../../apis/cashFlow';

import {
  FETCH_OCCURRENCES,
  SET_STARTING_BALANCE,
  SET_START_DATE,
  SET_END_DATE,
} from '../types';

export const setStartingBalance = balance => {
  return { type: SET_STARTING_BALANCE, payload: balance };
};

export const setStartDate = startDate => {
  return { type: SET_START_DATE, payload: startDate };
};

export const setEndDate = endDate => {
  return { type: SET_END_DATE, payload: endDate };
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