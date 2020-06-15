import cashFlow from '../apis/cashFlow';

import {
  FETCH_OCCURRENCES
} from './types';

export const fetchOccurrences = () => async dispatch => {
  const response = await cashFlow.get('/occurrences');

  dispatch({ type: FETCH_OCCURRENCES, payload: response.data });
};