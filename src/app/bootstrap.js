import React, {Component, PropTypes} from "react";
import {AppRegistry, Text, Navigator, View} from "react-native";
let {NavigationBar}=Navigator;
window.React = React;

class NavigationBarEx extends NavigationBar {
	get currentRoute() {
		let routes = this.props.navState.routeStack;
		if (routes.length && routes.length > 0) {
			return Object.assign({},routes[routes.length - 1]);
		}
		return null;
	}

	render() {
		console.log("render header : ", this.props);
		console.log("current route : ", this.currentRoute);
		if (this.currentRoute && this.currentRoute.hideNavigationBar) {
			return null;
		}
		return super.render();
	}

	refresh(ops={}){
		let routes = this.props.navState.routeStack;
		let route=routes[routes.length-1];
		routes[routes.length-1]=Object.assign({},route,ops);
		this.forceUpdate();
	}
}

class NavigatorEx extends Navigator {
	get currentRoute() {
		let routes = this.state.routeStack;
		if (routes.length && routes.length > 0) {
			return Object.assign({}, routes[routes.length - 1]);
		}
		return null;
	}

	_findRouteByPath(path) {
		let pathNames = path.split("/");
		let route;
		while (pathNames.length > 0) {
			let pathName = pathNames.shift();
			if (route) {
				if (route.routes) {
					route = route.routes.find(r=>r.path === pathName);
				}
				else {
					throw new Error(`${route.path} not defined routes`);
				}
			}
			else {
				route = this.props.routes.find(r=>r.path === pathName);
			}
		}
		if (!route) {
			throw new Error(`route not found , path = ${path}`);
		}
		return route;
	}


	$push(path,ops={}){
		let route = {
			...this._findRouteByPath(path),
			...ops
		};
		this.push(route);
	}
	$pop(){
		this.pop();
	}
	$replace(path,ops={}){
		let route = {
			...this._findRouteByPath(path),
			...ops
		};
		this.replace(route);
	}
	$refreshNavBar(ops={}){
		setTimeout(()=>{
			this._navBar.refresh(ops);
		},128);
	}

}

/*
 * react native router
 *
 * renderTitle:{function(route, navigator, index, navState)}
 * renderLeftButton:{function(route, navigator, index, navState)}
 * navigationBarStyle:{object}
 * routes:{array}
 * 	item:{
 *       path:{string}
 *       ,title:{string}
 *       ,renderLeftButton:{function}
 *       ,renderRightButton:{function}
 *       ,renderTitle:{function}
 *       ,hideNavigationBar:{boolean}
 *       ,navigationBarStyle:{object}
 *       ,routes:{array}
 *       ,onEnter:{function}
 *       ,onLeave:{function}
 * 	}
 *
 * scene有两个属性props.navigator,props.route
 * props.navigator.$push
 * props.navigator.$pop
 * props.navigator.$replace
 * props.navigator.$refreshNavBar
 *
 *
 * */
class Router extends Component {
	constructor(props) {
		super(props);
		this.initialRoute = props.routes[0];
		this.currentRoute = this.initialRoute;
		this.navigationBarEx=<NavigationBarEx ref="navigationBar" {...this._buildNavigationBar()}/>;
	}

	_buildNavigationBar() {
		let defaultRenderLeftButton = this.props.renderLeftButton;
		let defaultRenderTitle = this.props.renderTitle;
		let defaultNavigationBarStyle = this.props.navigationBarStyle || {};
		let navigationBarProps = {
			routeMapper: {
				LeftButton: (route, navigator, index, navState) => {
					console.log("render left button");
					if (index > 0) {
						if (route.renderLeftButton) {
							return route.renderLeftButton(route, navigator, index, navState);
						}
						if (defaultRenderLeftButton) {
							return defaultRenderLeftButton(route, navigator, index, navState);
						}
						console.warn("you don't set LeftButton");
					}
					return null;
				},
				RightButton: (route, navigator, index, navState) => {
					console.log("render right button");
					if (route.renderRightButton) {
						return route.renderRightButton(route, navigator, index, navState);
					}
					return null;
				},
				Title: (route, navigator, index, navState) => {
					console.log("render title");
					if (route.renderTitle) {
						return route.renderTitle(route, navigator, index, navState);
					}
					if (defaultRenderTitle) {
						return defaultRenderTitle(route, navigator, index, navState);
					}
					return <Text style={{color: "white"}}>{route.title}</Text>;
				}
			},
			style: defaultNavigationBarStyle
		};
		return navigationBarProps;
	}

	render() {
		console.log("render Router");
		return (
			<NavigatorEx initialRoute={this.initialRoute}
						 routes={this.props.routes}
						 ref="navigator"
						 navigationBar={this.navigationBarEx}
						 configureScene={(route, routeStack)=> {
							 return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
						 }}
						 renderScene={(route, navigator)=> {
							 console.log("render Scene");
							 this.currentRoute = route;
							 if (route.onEnter) {
								 let needRenderComponent = route.onEnter(route);
								 if (!needRenderComponent) {
									 throw  new Error(`${route.path} must return a available component when fire onEnter`);
								 }
								 return React.cloneElement(needRenderComponent, {
									 route: route,
									 navigator: navigator
								 });
							 }
							 return React.cloneElement(route.component, {
								 route: route,
								 navigator: navigator
							 });
						 }}></NavigatorEx>
		);
	}
}

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0
		};
		console.log("init home");
	}

	componentDidMount() {
		console.log("home did mount");
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
				<Text onPress={event=> {
					this.props.navigator.$push("register", {
						renderRightButton: ()=> {
							return <Text style={{color: "white"}}>ADD</Text>
						}
					});
				}}>go register</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: false
					});
				}}>show navigation bar</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: true
					});
				}}>hide navigation bar</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						title: "New Title"
					});
				}}>set title</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						title: "New Home"
					});
				}}>refresh</Text>
				<Text onPress={event=> {
					this.props.navigator.$replace("register");
				}}>replace</Text>
				<Text>go account</Text>
				<Text onPress={event=> {
					this.setState({count: this.state.count + 1});
				}}>{this.state.count}</Text>
			</View>
		);
	}
}

class RegisterStep1 extends Component {

	constructor(props) {
		super(props);
		console.log("init register step1");
	}

	componentDidMount() {
		this.props.navigator.$refreshNavBar({
			title:"abc"
		});
		// setTimeout(()=>{
		// 	this.props.navigator.$refreshNavBar({
		// 		title: "abc"
		// 	});
		// },1000);
		console.log("did mount");
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>

				<Text onPress={event=> {
					this.props.navigator.$push("register/step2", {
						message: "我是来自注册第一步的参数"
					});
				}}>go to register step2</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: true
					});
				}}>hide navigation bar</Text>
			</View>
		);
	}
}

class RegisterStep2 extends Component {

	render() {
		return (
			<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
				<Text onPress={event=> {
					this.props.navigator.$pop();
				}}>back</Text>
				<Text>{this.props.route.message}</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: false
					});
				}}>show navigation bar</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						renderRightButton: ()=> {
							return <Text style={{color: "white"}}>REGISTER</Text>
						}
					});
				}}>show right button</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						renderRightButton: null
					});
				}}>hide right button</Text>
			</View>
		);
	}
}

export default class Bootstrap extends Component {
	render() {
		return (
			<Router ref="router" renderTitle={(route)=> {
				return <Text style={{color: "white"}}>{route.title}</Text>;
			}}
					renderLeftButton={(route, navigator, index)=> {
						if (index > 0) {
							return <Text style={{color: "white"}} onPress={event=> {
								navigator.$pop();
							}}>back</Text>
						}
						return null;
					}}
					navigationBarStyle={{backgroundColor: "black"}}
					routes={[{
						path: "home",
						title: "Home",
						component: <Home></Home>
					}, {
						path: "register",
						title: "Register-Step1",
						component: <RegisterStep1></RegisterStep1>,
						routes: [{
							path: "step2",
							title: "Register-Step2",
							hideNavigationBar: true,
							component: <RegisterStep2/>
						}]
					}]}></Router>
		);
	}
}