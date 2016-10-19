import {combineReducers} from 'redux';
import demo from "./demo.reducer";
import error from "./error.reducer";
import menu from "./menu.reducer";
import {networkStatus} from "../utility/restfulClient";

export default combineReducers({
	demo
	, error
	, network: networkStatus
	, menu
})