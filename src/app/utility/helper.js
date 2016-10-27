import {AsyncStorage} from "react-native";

export function hasValue(value) {
	if (value === null || typeof value === "undefined") {
		return false;
	}
	return true;
}

export function setToken(value) {
    if (value) {
        return AsyncStorage.setItem($config.kTokenName, value);
    }
}

export function token() {
    return AsyncStorage.getItem($config.kTokenName);
}

export function removeToken() {
    return AsyncStorage.removeItem($config.kTokenName);
}

export function  setMyInfo(value) {
    if (value) {
        return AsyncStorage.setItem($config.kUserInfo, JSON.stringify(value));
    }
}
export function myInfo() {
    let userInfoStr = AsyncStorage.getItem($config.kUserInfo);
    if(userInfoStr){
        return JSON.parse(userInfoStr);
    }
    return null;
}
export function removeMyInfo() {
    return AsyncStorage.removeItem($config.kUserInfo);
}