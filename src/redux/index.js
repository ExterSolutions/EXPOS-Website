import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./authProvider/reducer";

const rootReducer = combineReducers({
  user: authReducer,
});

export default rootReducer;
