import cashFlow, { getHeaders } from '../../apis/cashFlow';

import {
  CREATE_SCHEDULE_EXCEPTION
} from '../types';

export const createScheduleException = scheduleException => async (dispatch, getState) => {
  const response = await cashFlow.post('/schedule-exceptions', scheduleException, {
    headers: getHeaders(getState().auth.user.token)
  });

  dispatch({ type: CREATE_SCHEDULE_EXCEPTION, payload: response.data });
};