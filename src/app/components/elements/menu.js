import BaseElement from "./baseElement";
import {viewStyles, textStyles, margin, padding, navigationStyles, colors} from "../../themes/default";
import {
	StyleSheet, View, Text,
	DeviceEventEmitter
} from "react-native";
import {toggleMenu} from "../../actions/menu.action";
import {connect} from "react-redux";
import Drawer from 'react-native-drawer';
import * as helper from "../../utility/helper"

export const TOGGLE_MENU = "TOGGLE_MENU";

const styles = StyleSheet.create({
	menu: {
		backgroundColor: colors.white,
		flex: 1,
	}
});

const mainOverlayStyle={
	backgroundColor: colors.black,
	opacity: 0.5
};

@connect()
class Menu extends BaseElement {
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

export default class DrawerWithMenu extends BaseElement {
	constructor(props) {
		super(props);

		this.open = false;
		DeviceEventEmitter.addListener(TOGGLE_MENU, (value)=> {
			if (helper.hasValue(value)) {
				this.open = value;
			}
			else {
				this.open = !this.open;
			}
			if (this.open) {
				this.refs.drawer.open();
			}
			else {
				this.refs.drawer.close();
			}
		});

		this.state = {
			showMask: false
		};

	}

	render() {
		let styles = {};
		if (this.state.showMask) {
			styles.mainOverlay = mainOverlayStyle;
		}
		return (
			<Drawer
				ref="drawer"
				styles={styles}
				onOpenStart={ratio=> {
					this.setState({showMask: true});
				}}
				onClose={ratio=> {
					this.setState({showMask: false});
				}}
				type="overlay"
				panOpenMask={100}
				panCloseMask={100}
				openDrawerOffset={100}
				content={<Menu/>}>
				{this.props.children}
			</Drawer>
		);
	}
}