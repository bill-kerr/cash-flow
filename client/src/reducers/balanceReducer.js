import {
  SET_STARTING_BALANCE
} from '../actions/types';

const INITIAL_STATE = {
  startingBalance: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_STARTING_BALANCE:
      return { ...state, startingBalance: action.payload };
    default:
      return state;
  }
};