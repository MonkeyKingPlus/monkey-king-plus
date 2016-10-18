import BaseElement from "./baseElement";
import {viewStyles, textStyles, margin,padding,navigationStyles,colors} from "../../themes/default";
import {StyleSheet,View,Text} from "react-native";
import {toggleMenu} from "../../actions/menu.action";
import {connect} from "react-redux";

const styles=StyleSheet.create({
	menu:{
		backgroundColor:colors.white,
		flex:1,
	}
});

@connect()
export default class Menu extends BaseElement {
	render() {
		return (
			<View style={[styles.menu]}>
				<Text style={textStyles.button}>Drawer</Text>
				<Text>Drawer</Text>
				<Text>Drawer</Text>
				<Text>Drawer</Text>
				<Text>Drawer</Text>
				<Text>Drawer</Text>
				<Text>Drawer</Text>
			</View>
		);
	}
}