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
	}],
	onEnter:()=>{
		//
		let state=store.getState();
		console.log(state);
		if(state){
			let loginState=state.loginReducer;
			if(!loginState.$isLogin){
				return "login";
			}
		}
	}
},  {
	path: "login",
	component: Login,
	hideNavigationBar:true
},{
	path: "demo",
	title: "Demo",
	component: Demo,
	onEnter:()=>{

	}
}];

export default routes;