import BaseElement from "./baseElement";
import {View, StyleSheet, Text} from "react-native";
import {connect} from "react-redux";
import * as Animatable from 'react-native-animatable';

@connect(({network})=>{
	return {
		...network
	}
})
export default class Network extends BaseElement {
	render() {
		return this.props.requestingCounter>0?<ActivityIndicator size="large"></ActivityIndicator>:null;
	}
}