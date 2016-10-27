import Home from "./components/pages/home";
import Demo from "./components/pages/demo";
import ArticleDetail from "./components/pages/articleDetail";
import Login from  "./components/pages/login"
const routes = [{
	path: "home",
	title: "MonkeyKingPlus",
	component:Home,
	routes:[{
		path:"articleDetail",
		component:ArticleDetail
	}]
},  {
	path: "login",
	component: Login,
	hideNavigationBar:true
},{
	path: "demo",
	title: "Demo",
	component: Demo
}];

export default routes;