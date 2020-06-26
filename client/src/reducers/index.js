import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import occurrenceReducer from './occurrenceReducer';
import balanceReducer from './balanceReducer';
import scheduleReducer from './scheduleReducer';

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  occurrences: occurrenceReducer,
  schedules: scheduleReducer,
  balance: balanceReducer
});