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
 * The action is calling when request is sending.
 * @param {object} reqConf - request options
 * @param {XMLHttpRequest} xhr
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