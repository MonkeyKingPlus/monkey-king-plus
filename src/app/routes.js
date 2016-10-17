import {Image} from "react-native";
import Home from "./components/pages/home";
import Register, {RegisterStep2} from "./components/pages/register";
import Demo from "./components/pages/demo";
import {navigationStyles} from "./themes/default";
import {TouchableHighlight} from "react-native";

const routes = [{
	path: "home",
	title: "MonkeyKingPlus",
	component:Home
}, {
	path: "register",
	title: "Register-Step1",
	component: Register,
	routes: [{
		path: "step2",
		title: "Register-Step2",
		component: RegisterStep2
	}]
}, {
	path: "demo",
	title: "Demo",
	component: Demo
}];

export default routes;