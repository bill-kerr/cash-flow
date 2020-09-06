import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { authReducer } from './auth/reducers';
import { AuthActionTypes } from './auth/types';
import { scheduleReducer } from './schedules/reducers';
import { ScheduleActionTypes } from './schedules/types';

export const rootReducer = combineReducers({
  auth: authReducer,
  schedules: scheduleReducer,
});

export type ActionTypes = AuthActionTypes | ScheduleActionTypes;

export type RootState = ReturnType<typeof rootReducer>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export type Dispatch = ThunkDispatch<RootState, any, ActionTypes>;
export const useTypedDispatch = () => useDispatch<Dispatch>();
