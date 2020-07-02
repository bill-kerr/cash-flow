import { mapKeys, omit } from 'lodash';
import {
  FETCH_SCHEDULES, 
  DELETE_SCHEDULE,
  CREATE_SCHEDULE
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_SCHEDULES:
      return { ...state, ...mapKeys(action.payload, 'id') };
    case CREATE_SCHEDULE:
      return { ...state, [action.payload.id]: action.payload };
    case DELETE_SCHEDULE:
      return omit(state, action.payload);
    default:
      return state;
  }
};