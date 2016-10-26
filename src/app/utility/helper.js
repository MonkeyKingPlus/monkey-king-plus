import {AsyncStorage} from "react-native";

export function hasValue(value) {
	if (value === null || typeof value === "undefined") {
		return false;
	}
	return true;
}

export function setToken(value) {

    console.log("token = ",value)
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
        return AsyncStorage.setItem($config.kUserInfo, value);
    }
}
export function myInfo() {
    return AsyncStorage.getItem($config.kUserInfo);
}
export function removeMyInfo() {
    return AsyncStorage.removeItem($config.kUserInfo);
}