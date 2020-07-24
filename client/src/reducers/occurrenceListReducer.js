import {
  FETCH_OCCURRENCES,
  SET_START_DATE,
  SET_END_DATE,
  SET_STARTING_BALANCE
} from '../actions/types';

const INITIAL_STATE = {
  occurrences: [],
  startDate: new Date(),
  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  startingBalance: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_OCCURRENCES:
      return { ...state, occurrences: [...action.payload] };
    case SET_START_DATE:
      return { ...state, startDate: action.payload };
    case SET_END_DATE:
      return { ...state, endDate: action.payload };
    case SET_STARTING_BALANCE:
      return { ...state, startingBalance: action.payload };
    default:
      return state;
  }
};