import {
  FETCH_OCCURRENCES
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_OCCURRENCES:
      return { ...state };
    default:
      return state;
  }
};