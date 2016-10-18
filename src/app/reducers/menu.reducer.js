import {TOGGLE_MENU} from "../actions/menu.action";
import * as helper from "../utility/helper";

const initialState = {
	open: false
};

export default function (state = initialState, action = {}) {
	let newState = Object.assign({}, state);
	switch (action.type) {
		case TOGGLE_MENU:
			if (helper.hasValue(action.value)) {
				newState.open = action.value.toLower() === "open";
			}
			else {
				newState.open = !newState.open;
			}
			return newState;
		default:
			return state;
	}
}