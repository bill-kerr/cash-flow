import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { authReducer } from './auth/reducers';
import { AuthActionTypes, SIGN_OUT } from './auth/types';

export const rootReducer = combineReducers({
  auth: authReducer,
});

export type ActionTypes = AuthActionTypes;

export type RootState = ReturnType<typeof rootReducer>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export type Dispatch = <TReturnType>(action: ActionTypes) => TReturnType;
export const useTypedDispatch = () => useDispatch<Dispatch>();

export type AsyncDispatch = ThunkDispatch<RootState, any, ActionTypes>;
export const useThunkDispatch = () => useDispatch<AsyncDispatch>();

export const fetchPosts: ThunkAction<Promise<void>, number, null, AuthActionTypes> = (ms: number) => async (dispatch: Dispatch, _getState: () => RootState) => {
  await new Promise((resolve) => setTimeout(() => resolve(1), ms));
  dispatch({ type: SIGN_OUT });
};

export const fetchPeople: ThunkAction<void, RootState, void, AuthActionTypes> = () => async (dispatch) => {
  await new Promise((resolve) => setTimeout(() => resolve(1), 3000));
  dispatch({ type:  });
};