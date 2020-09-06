import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState, Dispatch } from '..';
import { IFetchSchedulesCompleteAction, FETCH_SCHEDULES_START, FETCH_SCHEDULES_COMPLETE } from './types';
import { cashFlowClient } from '../../apis/cash-flow/client';

export const getSchedules: ActionCreator<ThunkAction<
  Promise<IFetchSchedulesCompleteAction>,
  RootState,
  null,
  IFetchSchedulesCompleteAction
>> = () => {
  return async (dispatch: Dispatch, getState) => {
    dispatch({ type: FETCH_SCHEDULES_START });

    const { auth } = getState();
    if (!auth.user?.token) {
      return dispatch({ type: FETCH_SCHEDULES_COMPLETE, schedules: [] });
    }

    const [schedules] = await cashFlowClient.getSchedules(auth.user.token);
    return dispatch({ type: FETCH_SCHEDULES_COMPLETE, schedules });
  };
};
