import cashFlow, { getHeaders } from '../../apis/cashFlow';

import {
  CREATE_SCHEDULE_EXCEPTION
} from '../types';

export const createScheduleException = scheduleException => (dispatch, getState) => {
  return cashFlow.post('/schedule-exceptions', scheduleException, {
    headers: getHeaders(getState().auth.user.token)
  }).then(res => {
    dispatch({ type: CREATE_SCHEDULE_EXCEPTION, payload: res.data });
    return res.data;
  }).catch(error => {
    return error.response.data;
  });
};