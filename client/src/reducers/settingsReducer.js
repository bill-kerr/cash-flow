import {
  SET_CURRENCY_CODE
} from '../actions/types';

const INITIAL_STATE = {
  currencyCode: 'usd'
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CURRENCY_CODE:
      return { ...state, currencyCode: action.payload };
    default:
      return state;
  }
};