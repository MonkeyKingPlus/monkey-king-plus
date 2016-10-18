export function hasValue(value) {
	if (value === null || typeof value === "undefined") {
		return false;
	}
	return true;
}