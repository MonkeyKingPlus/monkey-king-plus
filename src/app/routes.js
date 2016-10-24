import Home from "./components/pages/home";
import Register, {RegisterStep2} from "./components/pages/register";
import Demo from "./components/pages/demo";
import ArticleDetail from "./components/pages/articleDetail";
import Login from  "./components/pages/login"
const routes = [ {
	path: "login",
	component: Login,
	hideNavigationBar:true
},{
	path: "home",
	title: "MonkeyKingPlus",
	component:Home,
	routes:[{
		path:"articleDetail",
		component:ArticleDetail
	}]
}, {
	path: "demo",
	title: "Demo",
	component: Demo
}];

export default routes;