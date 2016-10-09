import * as globalAction from "../actions/global.action";

const initialGlobalState = {
	// if >0 show loading else hide loading
	// component don't display loading never when the request is called once.
	loadingCounter: 0,
	//current all error
	errors: [],
	//current all xhr
	xhrs: {},

	//all requested http
	requested: [],

	//action type
	type: null
};

export default function (state = initialGlobalState, action = {}) {

	let newState = {...state};
	newState.type = action.type;

	switch (action.type) {
		case globalAction.REQUEST_BEGIN:
			//开始request
			//记录请求的xhr
			if (!newState.xhrs[action.key] && action.reqConf.canAbort) {
				newState.xhrs[action.key] = action.xhr;
			}
			//如果请求是第一次请求则显示loading,否则不显示
			if (newState.requested.indexOf(action.key) <= -1) {
				newState.loadingCounter++;
			}
			return newState;
		case globalAction.REQUEST_END:
			//结束request
			//清除对应的xhr
			if (newState.xhrs[action.key]) {
				delete newState.xhrs[action.key];
			}
			//如果是第一次请求的request需要递减loading
			if (newState.loadingCounter > 0
				&& newState.requested.indexOf(action.key) <= -1) {
				newState.loadingCounter--;
			}
			//记录已经请求过的request
			if (newState.requested.indexOf(action.key) <= -1) {
				newState.requested.push(action.key);
			}
			return newState;
		/* businessError **************************************************************/
		case globalAction.SYSTEM_ERROR:
		case globalAction.BUSINESS_ERROR:
			newState.errors.push({
				code:action.code,
				message:action.message
			});
			return newState;
		case globalAction.CLEAN_ERROR:
			newState.errors = [];
			return newState;

		/* default **************************************************************/
		default:
			return state;
	}
}