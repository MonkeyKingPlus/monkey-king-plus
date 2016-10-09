import { combineReducers } from 'redux';
import demo from "./demo.reducer";
import global from "./global.reducer";
import error from "./error.reducer";
import network from "./network.reducer";

export default combineReducers({
	demo,global,error,network
})