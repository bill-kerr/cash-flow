import { Action, combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { authReducer } from './auth/reducers';
import { AuthActionTypes } from './auth/types';
import { scheduleReducer } from './schedules/reducers';
import { ScheduleActionTypes } from './schedules/types';
import { SettingsActionTypes } from './settings/types';
import { settingsReducer } from './settings/reducers';

export const rootReducer = combineReducers({
  auth: authReducer,
  schedules: scheduleReducer,
  settings: settingsReducer,
});

export type ActionTypes = AuthActionTypes | ScheduleActionTypes | SettingsActionTypes;

export type RootState = ReturnType<typeof rootReducer>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export type Dispatch = ThunkDispatch<RootState, any, ActionTypes>;
export const useTypedDispatch = () => useDispatch<Dispatch>();

export type AsyncAction<A extends Action> = (dispatch: Dispatch, getState: () => RootState) => Promise<A>;
export type AsyncActionCreator<A extends Action, T = undefined> = (...args: T[]) => AsyncAction<A>;
