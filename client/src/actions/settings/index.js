import {
  SET_CURRENCY_CODE
} from '../types';

export const setCurrencyCode = currencyCode => {
  return { type: SET_CURRENCY_CODE, payload: currencyCode };
};