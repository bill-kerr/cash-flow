import {
  SET_CURRENCY
} from '../types';

export const setCurrency = currency => {
  return { type: SET_CURRENCY, payload: currency };
};