export const SHOW_MESSAGE="SHOW_MESSAGE";
export const HIDE_MESSAGE="HIDE_MESSAGE";

export function showMessage(){
	return{
		type:SHOW_MESSAGE
	}
}

export function hideMessage(){
	return{
		type:HIDE_MESSAGE
	}
}