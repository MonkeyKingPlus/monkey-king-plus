import React, {Component, PropTypes} from "react";
import {AppRegistry, Text, Navigator, View} from "react-native";
let {NavigationBar}=Navigator;
window.React = React;
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
* 	}
*
* scene有两个属性props.navigator,props.route
* props.navigator.push
* props.navigator.pop
* props.navigator.replace
* props.navigator.refresh 此方法不能在Component的生命周期中调用
*
*
* */
class Router extends Component {
	constructor(props) {
		super(props);
		this.initialRoute = props.routes[0];
		this.currentRoute = this.initialRoute;
		this.refreshRouter=false;
		this.state = {
			hideNavigationBar: false
		};
	}

	buildNavigationBar() {
		let defaultRenderLeftButton = this.props.renderLeftButton;
		let defaultRenderTitle = this.props.renderTitle;
		let defaultNavigationBarStyle = this.props.navigationBarStyle || {};
		let navigationBarProps = {
			routeMapper: {
				LeftButton: (route, navigator, index, navState) => {
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
					if (route.renderRightButton) {
						return route.renderRightButton(route, navigator, index, navState);
					}
					return null;
				},
				Title: (route, navigator, index, navState) => {
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

	updateNavigationBarVisible(hideNavigationBar = false) {
		if (hideNavigationBar !== this.state.hideNavigationBar) {
			this.setState({hideNavigationBar: hideNavigationBar});
		}
	}

	push(path, ops = {}) {
		let route = {
			...this.getRouteByPath(path),
			...ops
		};
		this.updateNavigationBarVisible(route.hideNavigationBar);
		this.refs.navigator.push(route);

	}

	pop() {
		let routes=this.refs.navigator.getCurrentRoutes();
		let route=routes[routes.length-2];
		this.updateNavigationBarVisible(route.hideNavigationBar);
		this.refs.navigator.pop();
	}

	replace(path, ops = {}) {
		let route = {
			...this.getRouteByPath(path),
			...ops
		};
		this.updateNavigationBarVisible(route.hideNavigationBar);
		this.refs.navigator.replace(route);
	}

	refresh(ops={}){
		console.log("refresh")
		let route={
			...this.currentRoute,
			...ops
		};
		this.updateNavigationBarVisible(route.hideNavigationBar);
		this.refs.navigator.replace(route);
	}

	getRouteByPath(path) {
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

	render() {
		console.log("render Router");
		return (
			<Navigator initialRoute={this.initialRoute}
					   ref="navigator"
					   navigationBar={this.state.hideNavigationBar ? null :
						   <NavigationBar {...this.buildNavigationBar()}/>}
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
								   navigator: this
							   });
						   }
						   return React.cloneElement(route.component, {
							   route: route,
							   navigator: this
						   });
					   }}></Navigator>
		);
	}
}

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0
		};
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
				<Text onPress={event=> {
					this.props.navigator.push("register", {
						renderRightButton: ()=> {
							return <Text style={{color: "white"}}>ADD</Text>
						}
					});
				}}>go register</Text>
				<Text onPress={event=> {
					this.props.navigator.toggleNavigationBar(true);
				}}>show navigation bar</Text>
				<Text onPress={event=> {
					this.props.navigator.toggleNavigationBar(false);
				}}>hide navigation bar</Text>
				<Text onPress={event=> {
					this.props.navigator.refresh({
						title: "New Title"
					});
				}}>set title</Text>
				<Text onPress={event=> {
					this.props.navigator.refresh({
						title: "New Home"
					});
				}}>refresh</Text>
				<Text onPress={event=> {
					this.props.navigator.replace("register");
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

	render() {
		return (
			<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>

				<Text onPress={event=> {
					this.props.navigator.push("register/step2",{
						message:"我是来自注册第一步的参数"
					});
				}}>go to register step2</Text>
			</View>
		);
	}
}

class RegisterStep2 extends Component {

	render() {
		return (
			<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
				<Text onPress={event=> {
					this.props.navigator.pop();
				}}>back</Text>
				<Text>{this.props.route.message}</Text>
				<Text onPress={event=>{
					this.props.navigator.refresh({
						hideNavigationBar:false
					});
				}}>show navigation bar</Text>
				<Text onPress={event=>{
					this.props.navigator.refresh({
						renderRightButton:()=>{
							return <Text style={{color:"white"}}>REGISTER</Text>
						}
					});
				}}>show right button</Text>
				<Text onPress={event=>{
					this.props.navigator.refresh({
						renderRightButton:null
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
								this.refs.router.pop();
							}}>back</Text>
						}
						return null;
					}}
					navigationBarStyle={{backgroundColor: "black"}}
				/*
				 * {
				 * 	path:{string}
				 * 	,title:{string}
				 *   ,renderLeftButton:{function}
				 *	,renderRightButton:{function}
				 *	,renderTitle:{function}
				 *	,hideNavigationBar:{boolean}
				 *	,navigationBarStyle:{object}
				 * }
				 *
				 * */
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