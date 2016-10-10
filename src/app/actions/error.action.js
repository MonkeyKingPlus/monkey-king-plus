export const BUSINESS_ERROR = "BUSINESS_ERROR";
export const CLEAN_ERROR="CLEAN_ERROR";

export function cleanError(){
	return {
		type:CLEAN_ERROR
	}
}

export function businessError(message, ops = {
	code: 0,
	stack: "",
	delay: 5000
}) {
	return {
		type: BUSINESS_ERROR,
		data: {message, ...ops,$expire:Date.now()+ops.delay}
	}
}