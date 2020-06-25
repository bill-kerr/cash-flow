import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import occurrenceReducer from './occurrenceReducer';

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  occurrences: occurrenceReducer
});