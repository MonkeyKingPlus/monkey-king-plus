import React, {Component, PropTypes} from "react";
import {
	AppRegistry, Text, Navigator, View, StyleSheet,
	Image, TouchableHighlight
} from "react-native";
import Router from "react-native-router";
import {navigationStyles, viewStyles} from "./themes/default";
import {connect, Provider} from "react-redux";
import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from "./reducers";
import Menu from "./components/elements/menu";
import appConfig from "./config/app.config.json";
import routes from "./routes";
import {businessError} from "./actions/error.action";
import RESTfulClient from "restful-client";
import {beginRequest,endRequest} from "./actions/network.action";

// combine app config by environment
window.$config = Object.assign({}, appConfig, {...appConfig[appConfig.env]});

const RouterWithRedux = connect()(Router);

const middleware = [thunkMiddleware];

export const store = compose(
	applyMiddleware(...middleware)
)(createStore)(reducers);


const restClient = new RESTfulClient({
	beforeSend(options, dispatch){
		options.url = `${$config.host}${options.url}`;
	},
	sending(options,xhr,dispatch){
		if(dispatch){
			dispatch(beginRequest(options,xhr));
		}
	},
	received(options,response,xhr,dispatch){
		if(dispatch){
			dispatch(endRequest(options));
		}
	},
	// success(){},
	error(err,dispatch){
		dispatch(businessError(err.message || "系统错误"));
	},
	// complete(err,response,dispatch){
	// }
});
window.$req = restClient.request.bind(restClient);

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default class Bootstrap extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Provider store={store}>
					<Menu>
					<RouterWithRedux
						navigationBarStyle={navigationStyles.navigationBar}
						onChange={(type)=> {
								//console.log(type);
							}}
						renderTitle={(route)=> {
								return (
									<View style={[navigationStyles.base]}>
										<Text style={[navigationStyles.title]}>{route.title}</Text>
									</View>
								);
							}}
						renderLeftButton={(route, navigator, index)=> {
								if (index > 0) {
									return (
										<TouchableHighlight
											style={[navigationStyles.base, navigationStyles.leftButton]}
											onPress={event=> {
												navigator.$pop();
											}}>
											<Image source={require("./themes/assets/icons/back-icon.png")}/>
										</TouchableHighlight >
									);
								}
								return null;
							}}
						routes={routes}></RouterWithRedux>
				</Menu>
				</Provider>
			</View>
		);
	}
}