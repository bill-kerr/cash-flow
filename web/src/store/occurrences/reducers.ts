import { OccurrenceState, OccurrenceActionTypes, FETCH_OCCURRENCES_COMPLETE } from './types';

const initialState: OccurrenceState = {
  occurrences: [],
};

export const occurrenceReducer = (state = initialState, action: OccurrenceActionTypes) => {
  switch (action.type) {
    case FETCH_OCCURRENCES_COMPLETE:
      return { ...state, occurrences: action.occurrences };
    default:
      return state;
  }
};
