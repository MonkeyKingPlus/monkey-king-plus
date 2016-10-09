import { combineReducers } from 'redux';
import demo from "./demo.reducer";
import global from "./global.reducer";
import errors from "./error.reducer";

export default combineReducers({
	demo,global,errors
})