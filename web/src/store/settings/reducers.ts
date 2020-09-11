import { SettingsState, SettingsActionTypes, SET_CURRENT_CASH } from './types';

const initialState: SettingsState = { currentCash: 0 };

export const settingsReducer = (state = initialState, action: SettingsActionTypes) => {
  switch (action.type) {
    case SET_CURRENT_CASH:
      return { ...state, currentCash: action.cash };
    default:
      return state;
  }
};
