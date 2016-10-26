import {AsyncStorage} from "react-native";

export function hasValue(value) {
	if (value === null || typeof value === "undefined") {
		return false;
	}
	return true;
}

export function setToken(value) {
    if (value) {
        return AsyncStorage.setItem($config.tokenName, value);
    }
}

export function token() {
    return AsyncStorage.getItem($config.tokenName);
}

export function removeToken() {
    return AsyncStorage.removeItem($config.tokenName);
}