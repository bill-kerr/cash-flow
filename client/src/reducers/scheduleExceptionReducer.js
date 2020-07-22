//import { mapKeys, omit } from 'lodash';
import {
  CREATE_SCHEDULE_EXCEPTION
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case CREATE_SCHEDULE_EXCEPTION:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};