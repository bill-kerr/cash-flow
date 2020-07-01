import cashFlow from '../../apis/cashFlow';

import {
  FETCH_SCHEDULES,
} from '../types';

export const fetchSchedules = (token) => async dispatch => {
  const response = await cashFlow.get('/schedules', {
    headers: {
      'Authorization': `Bearer ${ token }`
    }
  });

  dispatch({ type: FETCH_SCHEDULES, payload: response.data.data });
};