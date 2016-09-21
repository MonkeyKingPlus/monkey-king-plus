import agent from "superagent";
import {token} from "./Helper.js";
import md5 from "md5";
import {unhandleError} from "../Actions/Error.action";

function genRequestKey(requestConf){
	let arr=[requestConf.url];
	if(requestConf.data){
		if(typeof requestConf.data ==="object"){
			arr.push(JSON.stringify(requestConf.data));
		}
		else{
			arr.push(requestConf.data);
		}
	}
	return md5(arr.join(""));
}

export const REQUEST_BEGIN="REQUEST_BEGIN";
export const REQUEST_END="REQUEST_END";
export function beginRequest(requestConf,xhr){
	return {
		type:REQUEST_BEGIN,
		key:genRequestKey(requestConf),
		requestConf,
		xhr
	};
}
export function endRequest(requestConf,xhr){
	return {
		type:REQUEST_END,
		key:genRequestKey(requestConf),
		requestConf,
		xhr
	};
}

class RestClient2 {
	request(conf,dispatch) {
		let options = Object.assign({}, conf);
		if (!options.type) {
			options.type = "get";
		}
		options.url = `${$config.APIHost}${conf.url}`;
		if (!options.headers) {
			options.headers = {};
		}
		options.headers[$config.AppIDName] = $config.AppID;
		if (options.type.toLowerCase() === "post") {
			options.headers["content-type"] = "application/json";
		}
		return token().then(tokenValue=> {
			options.headers[$config.TokenName] = tokenValue;
			return new Promise((resolve, reject)=> {
				let req = agent[options.type](options.url).set(options.headers);
				if(dispatch){
					dispatch(beginRequest(options,req));
				}
				if (options.data) {
					req.send(options.data);
				}
				req.end((err, response)=> {
					if(dispatch){
						dispatch(endRequest(options,req));
					}
					if (err) {
						dispatch(unhandleError(err));
						//reject(err);
					}
					else{
						response.json=()=>{
							return response.body;
						};
						resolve(response);
					}
				});
			});
		});
	}
}

export default new RestClient2();