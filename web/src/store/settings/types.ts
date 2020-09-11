export interface SettingsState {
  currentCash: number;
}

export const SET_CURRENT_CASH = 'Settings:SetCurrentCash';

export interface ISetCurrentCashAction {
  type: typeof SET_CURRENT_CASH;
  cash: number;
}

export type SettingsActionTypes = ISetCurrentCashAction;
