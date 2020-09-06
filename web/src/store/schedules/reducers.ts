import { mapKeys } from 'lodash';
import { ScheduleState, ScheduleActionTypes, FETCH_SCHEDULES_COMPLETE } from './types';

const initialState: ScheduleState = {
  schedules: {},
};

export const scheduleReducer = (state = initialState, action: ScheduleActionTypes) => {
  switch (action.type) {
    case FETCH_SCHEDULES_COMPLETE:
      return { ...state, schedules: mapKeys(action.schedules, 'id') };
    default:
      return state;
  }
};
