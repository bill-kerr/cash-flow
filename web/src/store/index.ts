import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector, ConnectedProps, connect } from 'react-redux';
import { authReducer } from './auth/reducers';
import { SIGN_IN, SIGN_OUT } from './auth/types';

export const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const mapState = (state: RootState) => ({ auth: state.auth });
const mapDispatch = {
  signIn: () => ({ type: SIGN_IN }),
  signOut: () => ({ type: SIGN_OUT }),
};
export const connector = connect(mapState, mapDispatch);
export type PropsFromRedux = ConnectedProps<typeof connector>;
