import { AsyncActionCreator } from '..';

const SET_CURRENT_CASH = 'Settings:SetCurrentCash';

interface ISetCurrentCashAction {
  type: typeof SET_CURRENT_CASH;
  cash: number;
}

export const setCurrentCash: AsyncActionCreator<ISetCurrentCashAction, number> = (cash) => {
  return async (dispatch) => {
    return dispatch({ type: SET_CURRENT_CASH, cash });
  };
};
