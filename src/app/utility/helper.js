import {AsyncStorage} from "react-native";

export function hasValue(value) {
	if (value === null || typeof value === "undefined") {
		return false;
	}
	return true;
}