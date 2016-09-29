import agent from "superagent";
import * as globalAction from "../actions/global.action";

class RestClient {
	request(conf, dispatch) {
		let options = Object.assign({}, conf);
		if (!options.type) {
			options.type = "get";
		}
		else{
			options.type=options.type.toLowerCase();
		}
		options.url = `${$config.APIHost}${conf.url}`;
		if (!options.headers) {
			options.headers = {};
		}
		//options.headers[$config.AppIDName] = $config.AppID;
		if (options.type === "post") {
			options.headers["content-type"] = "application/json";
		}
		return new Promise((resolve, reject)=> {
			let req = agent[options.type](options.url).set(options.headers);
			if (dispatch) {
				dispatch(globalAction.beginRequest(options, req));
			}
			if (options.data) {
				req.send(options.data);
			}
			req.end((err, response)=> {
				if (dispatch) {
					dispatch(globalAction.endRequest(options, req));
				}
				if (err) {
					dispatch(globalAction.systemError(err));
					//reject(err);
				}
				else {
					// response.json = ()=> {
					// 	return response.body;
					// };
					resolve(response);
				}
			});
		});
	}
}

export default new RestClient();