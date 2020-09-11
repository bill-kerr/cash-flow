import { AsyncAction } from '..';
import {
  IFetchOccurrencesCompleteAction,
  FETCH_OCCURRENCES_START,
  FETCH_OCCURRENCES_COMPLETE,
  IFetchOccurrencesErrorAction,
  FETCH_OCCURRENCES_ERROR,
} from './types';
import { cashFlowClient } from '../../apis/cash-flow/client';
import { isErrorResponse } from '../../utils';

export const getOccurrences = (
  startDate: string,
  endDate: string
): AsyncAction<IFetchOccurrencesErrorAction | IFetchOccurrencesCompleteAction> => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_OCCURRENCES_START });

    const { auth } = getState();
    if (!auth.user?.token) {
      return dispatch({ type: FETCH_OCCURRENCES_COMPLETE, occurrences: [] });
    }

    const res = await cashFlowClient.getOccurrences(auth.user.token, startDate, endDate);
    if (isErrorResponse(res)) {
      return dispatch({ type: FETCH_OCCURRENCES_ERROR, error: JSON.stringify(res) });
    }

    return dispatch({ type: FETCH_OCCURRENCES_COMPLETE, occurrences: res.data });
  };
};
