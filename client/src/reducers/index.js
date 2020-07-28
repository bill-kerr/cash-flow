import { combineReducers } from "redux";
import authReducer from "./authReducer";
import occurrenceReducer from "./occurrenceListReducer";
import scheduleReducer from "./scheduleReducer";
import exceptionReducer from "./exceptionReducer";
import settingsReducer from "./settingsReducer";

export default combineReducers({
  auth: authReducer,
  occurrenceList: occurrenceReducer,
  schedules: scheduleReducer,
  exceptions: exceptionReducer,
  settings: settingsReducer,
});
