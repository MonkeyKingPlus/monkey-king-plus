import agent from "superagent";

/**
 * RESTful client
 * @class
 * */
export default class RESTfulClient {
	/**
	 * @constructor
	 * @param {object} ops
	 * @param {function} [ops.beforeSend=noop]
	 * @param {function} [ops.sending=noop]
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
			 * It is fired when request is sending.
			 * the beginRequest action is invoked by default and the parameter dispatch is provided.
			 * @param {object} options - request options
			 * @param {XMLHttpRequest} xhr
			 * @param {function} dispatch
			 * */
			sending(options,xhr,dispatch){},
			/**
			 * It is fired when response is received right now.
			 * the endRequest action is invoked by default and the parameter dispatch is provided.
			 * @param {object} options - request options
			 * @param {object} response
			 * @param {XMLHttpRequest} xhr
			 * @param {function} dispatch
			 * */
			received(options,response,xhr,dispatch){},
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
	 * @param {function} dispatch - optional , if you provide the parameter dispatch , you can know the network status from network status reducer.
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
			this.ops.sending(options,req,dispatch);
			if (options.data) {
				req.send(options.data);
			}
			req.end((err, response)=> {
				this.ops.received(options,response,req,dispatch);
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
