import { combineReducers } from 'redux';
import authReducer from './authReducer';
import occurrenceReducer from './occurrenceListReducer';
import scheduleReducer from './scheduleReducer';
import scheduleExceptionReducer from './scheduleExceptionReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({
  auth: authReducer,
  occurrenceList: occurrenceReducer,
  schedules: scheduleReducer,
  scheduleExceptions: scheduleExceptionReducer,
  settings: settingsReducer,
});