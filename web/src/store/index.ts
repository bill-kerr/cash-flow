import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { authReducer } from './auth/reducers';
import { AuthActionTypes } from './auth/types';

export const rootReducer = combineReducers({
  auth: authReducer,
});

export type ActionTypes = AuthActionTypes;

export type RootState = ReturnType<typeof rootReducer>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

// export type Dispatch = <TReturnType>(action: ActionTypes) => TReturnType;
// export const useTypedDispatch = () => useDispatch<Dispatch>();

export type Dispatch = ThunkDispatch<RootState, any, ActionTypes>;
export const useTypedDispatch = () => useDispatch<Dispatch>();
