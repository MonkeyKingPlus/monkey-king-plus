import Home from "./components/pages/home";
import Demo from "./components/pages/demo";
import ArticleDetail from "./components/pages/articleDetail";
import Login from  "./components/pages/login";

import {store} from "./bootstrap";

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
	component: Demo,
	onEnter:()=>{
		console.log("enter demo")
		//
		let state=store.getState();
		console.log(state.loginReducer);
		if(state){
			let loginState=state.loginReducer;
			if(!loginState.$isLogin){
				return "login";
			}
		}
	}
}];

export default routes;