import {BUSINESS_ERROR,CLEAN_ERROR} from "../actions/error.action";

const initialState={
	errors:[]
};

export default function(state=initialState,action={}){
	switch(action.type){
		case BUSINESS_ERROR:
			return {
				...state,
				errors:[...state.errors,action.data]
			};
		case CLEAN_ERROR:
			return {
				...state,
				errors:[]
			};
		default:
			return state;
	}
}