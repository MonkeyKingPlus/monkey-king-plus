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

export const BEGIN_REQUEST="BEGIN_REQUEST";
export const END_REQUEST="END_REQUEST";

export function beginRequest(reqConf, xhr) {
	return {
		type: BEGIN_REQUEST,
		key: genRequestKey(reqConf),
		xhr
	};
}

export function endRequest(reqConf) {
	return {
		type: END_REQUEST,
		key: genRequestKey(reqConf)
	};
}