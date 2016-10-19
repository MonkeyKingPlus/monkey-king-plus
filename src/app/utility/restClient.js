import agent from "superagent";
import md5 from "md5";

export const BEGIN_REQUEST="BEGIN_REQUEST";
export const END_REQUEST="END_REQUEST";

function genRequestKey(requestConf) {
	let arr = [requestConf.url];
	if (requestConf.data) {
		if (typeof requestConf.data === "object") {
			arr.push(JSON.stringify(requestConf.data));
		}
		else {
			arr.push(requestConf.data);
		}
	}
	return md5(arr.join(""));
}
/**
 * The action is calling when request is sent before.
 * @param {object} reqConf - request options
 * @param {object} xhr - XMLHttpRequest
 * @returns {object}
 * */
export function beginRequest(reqConf, xhr) {
	return {
		type: BEGIN_REQUEST,
		key: genRequestKey(reqConf),
		xhr,
		reqConf
	};
}
/**
 * The action is calling when response is received.
 * @param {object} reqConf - request options
 * @returns {object}
 * */
export function endRequest(reqConf) {
	return {
		type: END_REQUEST,
		key: genRequestKey(reqConf),
		reqConf
	};
}

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

/**
 * RESTful client
 * @class
 * */
export default class RestClient {
	/**
	 * @constructor
	 * @param {object} ops
	 * @param {function} [ops.beforeSend=noop]
	 * @param {function} [ops.success=noop]
	 * @param {function} [ops.error=noop]
	 * @param {function} [ops.complete=noop]
	 * */
	constructor(ops={}){
		this.ops=Object.assign({
			/**
			 * It is calling before send. you can overwrite request options in this time.
			 * @param {object} options - options is ref request options
			 * @param {function} dispatch
			 * */
			beforeSend(options,dispatch){},
			/**
			 * It is fired when the request have any error.
			 * @param {object} response
			 * @param {funciton} dispatch
			 * */
			success(response,dispatch){},
			/**
			 * It is fired when error occur
			 * @param {object} err
			 * @param {function} dispatch
			 * */
			error(err,dispatch){},
			/**
			 * It is fired when all is done
			 * @param {object} options - current request options
			 * @param {function} dispatch
			 * */
			complete(options,dispatch){}
		},ops)
	}

	/**
	 * request
	 * @param {object} conf - request options
	 * @param {string} conf.url - url is required
	 * @param {string} [conf.type=get] - request method
	 * @param {boolean} [conf.canAbort=false] - marking the request can be terminated.
	 * @param {object} [headers={}] - http headers, default content-type's value will be set to "application/json;utf-8" when conf.type is post
	 * @param {object} conf.data - request data
	 * */
	request(conf, dispatch) {
		let options = Object.assign({
			canAbort:false
		}, conf);
		if (!options.type) {
			options.type = "get";
		}
		else {
			options.type = options.type.toLowerCase();
		}
		// options.url = `${$config.APIHost}${conf.url}`;
		if (!options.headers) {
			options.headers = {};
		}
		if (options.type === "post") {
			options.headers["content-type"] = "application/json;utf-8";
		}
		this.ops.beforeSend(options,dispatch);
		return new Promise((resolve, reject)=> {
			let req = agent[options.type](options.url).set(options.headers);
			if (dispatch) {
				dispatch(beginRequest(options, req));
			}
			if (options.data) {
				req.send(options.data);
			}
			req.end((err, response)=> {
				if (dispatch) {
					dispatch(endRequest(options, req));
				}
				if (err) {
					this.ops.error(err,dispatch);
					//reject(err);
				}
				else {
					this.ops.success(response,dispatch);
					resolve(response);
				}
				this.ops.complete(options,dispatch);
			});
		});
	}
}
