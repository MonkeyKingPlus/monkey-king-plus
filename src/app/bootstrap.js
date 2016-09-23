import React, {Component, PropTypes} from "react";
import {AppRegistry, Text, Navigator, View} from "react-native";
let {NavigationBar}=Navigator;
window.React = React;

// const initialNavigationBarProps = {
// 	routeMapper: {
// 		LeftButton: (route, navigator, index, navState) => {
// 			if (index > 0) {
// 				if (route.renderLeftButton) {
// 					return route.renderLeftButton(route, navigator, index, navState);
// 				}
//
// 				return <Text style={{color: "white"}} onPress={event=> {
// 					navigator.pop();
// 				}}>Back</Text>
// 			}
// 			return null;
// 		},
// 		RightButton: (route, navigator, index, navState) =>null,
// 		Title: (route, navigator, index, navState) => {
// 			return <Text style={{color: "white"}}>{route.title}</Text>;
// 		}
// 	},
// 	style: {
// 		backgroundColor: "black"
// 	}
// }

// const defaultNavigatorOps = {
// 	navigationBar: <NavigationBar routeMapper={{
// 		LeftButton: (route, navigator, index, navState) =>null,
// 		RightButton: (route, navigator, index, navState) =>null,
// 		Title: (route, navigator, index, navState) =><Text style={{color: "white"}}>{route.title}</Text>
// 	}}></NavigationBar>
// };

class Routes extends Component {
	constructor(props) {
		super(props);
		this.initialRoute = props.routes[0];
		// this.currentRoute = this.initialRoute;
		this.state = {
			hideNavigationBar: this.initialRoute.hideNavigationBar || false,
			navigationBarProps: this.buildNavigationBar(this.initialRoute)
		};
	}

	buildNavigationBar(route) {
		let defaultRenderLeftButton = this.props.renderLeftButton;
		let defaultRenderTitle = this.props.renderTitle;
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
				RightButton: (route, navigator, index, navState) =>null,
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
			style: route.navigationBarStyle || this.props.navigationBarStyle || {}
		};
		return navigationBarProps;
	}


	push(path) {
		let route = this.getRouteByPath(path);
		this.refs.navigator.push(route);
	}

	pop() {
		this.refs.navigator.pop();
	}

	replace(path) {
		let route = this.getRouteByPath(path);
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
		// else {
		// 	if (!route.component && route.routes && route.routes.length > 0) {
		// 		if (route.routes && route.routes.length > 0) {
		// 			route = route.routes[0];
		// 		}
		// 		else {
		// 			throw new Error(`${route.path} find nothing child route`);
		// 		}
		// 	}
		//
		// }
		return route;
	}

	render() {
		console.log("Routes render ...");
		return (
			<Navigator initialRoute={this.initialRoute}
					   ref="navigator"
					   navigationBar={this.state.hideNavigationBar ? null :
						   <NavigationBar {...this.state.navigationBarProps}/>}
					   configureScene={(route, routeStack)=> {
						   return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
					   }}
					   renderScene={(route, navigator)=> {
						   console.log("render scene ...");
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
						   console.log("current route : ", route);
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
					this.props.navigator.push("register");
				}}>go register</Text>
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
					this.props.navigator.push("register/step2");
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
			</View>
		);
	}
}

export default class Bootstrap extends Component {
	render() {
		return (
			<Routes renderTitle={(route)=> {
				console.log("render title : ", route.title);
				return <Text style={{color: "white"}}>{route.title}</Text>;
			}}
					renderLeftButton={(route, navigator, index)=> {
						if (index > 0) {
							return <Text style={{color: "white"}} onPress={event=> {
								navigator.pop();
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
					}]}></Routes>
		);
	}
}