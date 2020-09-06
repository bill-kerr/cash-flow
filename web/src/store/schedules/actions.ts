import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState, Dispatch } from '..';
import { IFetchSchedulesCompleteAction, FETCH_SCHEDULES_START, FETCH_SCHEDULES_COMPLETE } from './types';

export const signIn: ActionCreator<ThunkAction<
  Promise<IFetchSchedulesCompleteAction>,
  RootState,
  null,
  IFetchSchedulesCompleteAction
>> = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_SCHEDULES_START });
    return dispatch({ type: FETCH_SCHEDULES_COMPLETE, schedules: [] });
  };
};
