import { combineReducers } from 'redux';
import demo from "./demo.reducer";
import global from "./global.reducer"

export default combineReducers({
	demo,global
})