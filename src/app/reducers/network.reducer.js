import {BEGIN_REQUEST,END_REQUEST} from "../actions/network.action";

const initialState={
	requestingCounter:0,
	xhrs:{},
	requested:[]
};

/**
 * RESTful status reducer
 * @param {object} state
 * @param {number} [state.requestingCounter=0]
 * @param {object} xhrs
 * @param {array} requested
 * @param {object} action
 * @param {string} action.type
 * @returns {object}
 * */
export function networkStatus(state=initialState,action={}){
	let newState={...state};
	switch(action.type){
		case BEGIN_REQUEST:
			//loading +1
			if(newState.requested.indexOf(action.key)<0) {
				newState.requestingCounter++;
			}
			//如果canAbort＝true，保存正在请求的xhr
			//默认canAbort=false
			if(!newState.xhrs[action.key]  && action.reqConf.canAbort){
				newState.xhrs[action.key]=action.xhr;
			}
			return newState;
		case END_REQUEST:
			//loading -1
			if(newState.requested.indexOf(action.key)<0) {
				newState.requestingCounter--;
			}
			//清除对应的xhr
			if (newState.xhrs[action.key]) {
				delete newState.xhrs[action.key];
			}
			if(!action.reqConf.canAbort && newState.requested.indexOf(action.key)<0){
				newState.requested.push(action.key);
			}
			return newState;
		default:
			return state;
	}
}