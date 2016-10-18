import BaseElement from "./baseElement";
import {viewStyles, textStyles, margin, padding, navigationStyles, colors} from "../../themes/default";
import {
	StyleSheet, View, Text,
	DeviceEventEmitter,
	Image
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
	},
	menuTop: {
		height: 172,
		backgroundColor: colors.black
	}
});

const mainOverlayStyle = {
	backgroundColor: colors.black,
	opacity: 0.5
};

@connect()
class Menu extends BaseElement {
	render() {
		return (
			<View style={[styles.menu]}>
				<View style={styles.menuTop}>
					<Image/>
				</View>
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
				tapToClose={true}
				type="overlay"
				openDrawerOffset={100}
				content={<Menu/>}>
				{this.props.children}
			</Drawer>
		);
	}
}