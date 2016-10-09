import md5 from "md5";

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

export const REQUEST_BEGIN = "REQUEST_BEGIN";
export const REQUEST_END = "REQUEST_END";
export const BUSINESS_ERROR="BUSINESS_ERROR";
export const CLEAN_ERROR="CLEAN_ERROR";
export const SYSTEM_ERROR="SYSTEM_ERROR";

export function beginRequest(reqConf, xhr) {
	return {
		type: REQUEST_BEGIN,
		key: genRequestKey(reqConf),
		xhr
	};
}

export function endRequest(reqConf) {
	return {
		type: REQUEST_END,
		key: genRequestKey(reqConf)
	};
}

export function businessError(res){
	console.log("action : businessError")
	return {
		type:BUSINESS_ERROR,
		code:res.Code || res.code,
		message:res.Message || res.message
	}
}

export function systemError(err){
	return {
		type:SYSTEM_ERROR,
		message:err.message || "system error",
		stack:err
	};
}

export function initial(){
	return function(dispatch){

	}
}