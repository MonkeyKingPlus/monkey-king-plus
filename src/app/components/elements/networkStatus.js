import BaseElement from "./baseElement";
import {View, StyleSheet, ActivityIndicator} from "react-native";
import {connect} from "react-redux";
import * as Animatable from 'react-native-animatable';

const styles=StyleSheet.create({
	networkStatus:{
		position:"absolute",
		top:0,
		bottom:0,
		left:0,
		right:0,
		backgroundColor:"rgba(0,0,0,0.6)"
	}
});

@connect(({network})=>{
	return {
		...network
	}
})
export default class NetworkStatus extends BaseElement {
	render() {
		return this.props.requestingCounter>0?<ActivityIndicator size="large" style={styles.networkStatus}></ActivityIndicator>:null;
	}
}