import { AsyncActionCreator } from '..';
import { IFetchSchedulesCompleteAction, FETCH_SCHEDULES_START, FETCH_SCHEDULES_COMPLETE } from './types';
import { cashFlowClient } from '../../apis/cash-flow/client';

export const getSchedules: AsyncActionCreator<IFetchSchedulesCompleteAction> = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SCHEDULES_START });

    const { auth } = getState();
    if (!auth.user?.token) {
      return dispatch({ type: FETCH_SCHEDULES_COMPLETE, schedules: [] });
    }

    const [schedules] = await cashFlowClient.getSchedules(auth.user.token);
    return dispatch({ type: FETCH_SCHEDULES_COMPLETE, schedules });
  };
};
