import {SHOW_MESSAGE,HIDE_MESSAGE} from "../actions/demo.action";

const initialState={
	message:"hello world!",
	show:true
};

export default function(state=initialState,action={}){
	switch(action.type){
		case SHOW_MESSAGE:
			return{
				...state,
				show:true
			}
		case HIDE_MESSAGE:
			return{
				...state,
				show:false
			}
		default:
			return state;
	}
}