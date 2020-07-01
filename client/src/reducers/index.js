import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import occurrenceReducer from './occurrenceListReducer';
import scheduleReducer from './scheduleReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  occurrenceList: occurrenceReducer,
  schedules: scheduleReducer,
  settings: settingsReducer
});