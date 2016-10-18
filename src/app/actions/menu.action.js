export const TOGGLE_MENU = "TOGGLE_MENU";

export function toggleMenu(value) {
	return {
		type: TOGGLE_MENU,
		value
	};
}