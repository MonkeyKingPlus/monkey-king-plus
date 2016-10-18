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

// combine app config by environment
import appConfig from "./config/app.config.json";
window.$config = Object.assign({}, appConfig, {...appConfig[appConfig.env]});

const RouterWithRedux = connect()(Router);

const middleware = [thunkMiddleware];

export const store = compose(
	applyMiddleware(...middleware)
)(createStore)(reducers);

import routes from "./routes";

import RestClient from "./utility/restClient";
const restClient = new RestClient({
	beforeSend(options, dispatch){
		options.url = `${$config.host}${options.url}`;
	}
	// success(){},
	// error(err){
	// },
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
								console.log(type);
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
											<Image source={require("./themes/assets/back-icon.png")}/>
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