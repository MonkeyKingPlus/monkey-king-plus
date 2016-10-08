import React, {Component, PropTypes} from "react";
import {AppRegistry, Text, Navigator, View} from "react-native";
import Router from "react-native-router";
import {navigationStyles, viewStyles} from "./themes/default";
import {connect, Provider} from "react-redux";
import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from "./reducers";

const RouterWithRedux = connect()(Router);

const middleware = [thunkMiddleware];

export const store = compose(
	applyMiddleware(...middleware)
)(createStore)(reducers);

import routes from "./routes";

export default class Bootstrap extends Component {
	render() {
		return (
			<Provider store={store}>
				<RouterWithRedux navigationBarStyle={navigationStyles.navigationBar}
								 renderTitle={(route)=> {
									 return <Text style={[navigationStyles.title]}>{route.title}</Text>;
								 }}
								 renderLeftButton={(route, navigator, index)=> {
									 if (index > 0) {
										 return <Text style={[navigationStyles.backButton]} onPress={event=> {
											 navigator.$pop();
										 }}>back</Text>
									 }
									 return null;
								 }}

								 routes={routes}></RouterWithRedux>
			</Provider>
		);
	}
}