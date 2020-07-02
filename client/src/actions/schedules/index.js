import cashFlow, { getHeaders } from '../../apis/cashFlow';

import {
  FETCH_SCHEDULES,
  DELETE_SCHEDULE,
  CREATE_SCHEDULE
} from '../types';

export const fetchSchedules = () => async (dispatch, getState) => {
  const response = await cashFlow.get('/schedules', {
    headers: getHeaders(getState().auth.user.token)
  });

  dispatch({ type: FETCH_SCHEDULES, payload: response.data.data });
};

export const createSchedule = schedule => async (dispatch, getState) => {
  const response = await cashFlow.post('/schedules', schedule, {
    headers: getHeaders(getState().auth.user.token)
  });

  dispatch({ type: CREATE_SCHEDULE, payload: response.data });
};

export const deleteSchedule = scheduleId => async (dispatch, getState) => {
  const response = await cashFlow.delete(`/schedules/${ scheduleId }`, {
    headers: getHeaders(getState().auth.user.token)
  });

  dispatch({ type: DELETE_SCHEDULE, payload: response.data.id });
};