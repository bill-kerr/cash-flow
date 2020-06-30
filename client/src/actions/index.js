import cashFlow from '../apis/cashFlow';

import {
  SIGN_IN,
  FETCH_OCCURRENCES,
  FETCH_SCHEDULES,
  SET_STARTING_BALANCE,
  SET_START_DATE,
  SET_END_DATE
} from './types';

export const signIn = user => {
  return { type: SIGN_IN, payload: user };
};

export const setBalance = balance => {
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

export const fetchSchedules = (token) => async dispatch => {
  const response = await cashFlow.get('/schedules', {
    headers: {
      'Authorization': `Bearer ${ token }`
    }
  });

  dispatch({ type: FETCH_SCHEDULES, payload: response.data.data });
};