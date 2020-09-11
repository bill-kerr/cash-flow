import { DateFormat } from '../../types/DateFormat';

export interface SettingsState {
  currentCash: number;
  dateFormat: DateFormat;
}

export const SET_CURRENT_CASH = 'Settings:SetCurrentCash';
export const SET_DATE_FORMAT = 'Settings:SetDateFormat';

export interface ISetCurrentCashAction {
  type: typeof SET_CURRENT_CASH;
  cash: number;
}

export interface ISetDateFormatAction {
  type: typeof SET_DATE_FORMAT;
  format: DateFormat;
}

export type SettingsActionTypes = ISetCurrentCashAction | ISetDateFormatAction;
