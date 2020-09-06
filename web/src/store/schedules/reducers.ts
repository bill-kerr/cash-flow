import { ScheduleState, ScheduleActionTypes, FETCH_SCHEDULES_START } from './types';

const initialState: ScheduleState = {
  schedules: {},
};

export const scheduleReducer = (state = initialState, action: ScheduleActionTypes) => {
  switch (action.type) {
    case FETCH_SCHEDULES_START:
      return state;
    default:
      return state;
  }
};
