import { AsyncActionCreator } from '..';
import {
  IFetchSchedulesCompleteAction,
  FETCH_SCHEDULES_START,
  FETCH_SCHEDULES_COMPLETE,
  IFetchSchedulesErrorAction,
  FETCH_SCHEDULES_ERROR,
} from './types';
import { cashFlowClient } from '../../apis/cash-flow/client';
import { isErrorResponse } from '../../utils';

export const getSchedules: AsyncActionCreator<IFetchSchedulesCompleteAction | IFetchSchedulesErrorAction> = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SCHEDULES_START });

    const { auth } = getState();
    if (!auth.user?.token) {
      return dispatch({ type: FETCH_SCHEDULES_COMPLETE, schedules: [] });
    }

    const res = await cashFlowClient.getSchedules(auth.user.token);
    if (isErrorResponse(res)) {
      return dispatch({ type: FETCH_SCHEDULES_ERROR, error: JSON.stringify(res) });
    }

    return dispatch({ type: FETCH_SCHEDULES_COMPLETE, schedules: res.data });
  };
};
