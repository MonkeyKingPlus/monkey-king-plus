import Home from "./components/pages/home";
import Register, {RegisterStep2} from "./components/pages/register";
import Demo from "./components/pages/demo";

const routes=[{
	path: "home",
	title: "Home",
	component: <Home/>
}, {
	path: "register",
	title: "Register-Step1",
	component: <Register/>,
	routes: [{
		path: "step2",
		title: "Register-Step2",
		component: <RegisterStep2/>
	}]
}, {
	path: "demo",
	title: "Demo",
	component: <Demo/>
}];

export default routes;