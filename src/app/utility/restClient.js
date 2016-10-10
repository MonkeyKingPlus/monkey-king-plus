import agent from "superagent";
import {beginRequest, endRequest} from "../actions/network.action";
import {businessError} from "../actions/error.action";

export default class RestClient {
	constructor(ops={}){

		this.ops=Object.assign({
			beforeSend(options,dispatch){},
			success(response,dispatch){},
			error(err,dispatch){},
			complete(options,dispatch){}
		},ops)
	}
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
			options.headers["content-type"] = "application/json";
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
					dispatch(businessError(err.message || "系统错误"));
					reject(err);
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
