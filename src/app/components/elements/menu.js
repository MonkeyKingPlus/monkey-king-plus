import BaseElement from "./baseElement";
import {
	viewStyles, textStyles, margin, padding, navigationStyles,
	fontSizes,
	colors
} from "../../themes/default";
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
		backgroundColor: colors.black,
		...padding(0, 0, 0, 16)
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		...margin(60, 0, 0, 0)
	},
	name: {
		color: colors.white,
		fontSize: fontSizes.ft15,
		...margin(33, 0, 0, 0)
	},
	menuList: {
		...padding(0, 0, 0, 24)
	},
	menuListItem: {
		flexDirection: "row",
		...margin(19,0,0,0)
	},
	menuListItemIcon:{
		width:24,
		height:24
	},
	menuListItemText:{
		fontSize:fontSizes.ft14,
		...margin(0,0,0,24),
		alignItems:"center",
		lineHeight:24
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
					<Image style={styles.avatar} source={require("../../themes/assets/temp/dog.png")}/>
					<Text style={styles.name}>First Name</Text>
				</View>
				<View style={styles.menuList}>
					<View style={styles.menuListItem}>
						<Image style={styles.menuListItemIcon} source={require("../../themes/assets/icons/ic_mode_edit_black_24px.png")}/>
						<Text style={styles.menuListItemText}>更改密码</Text>
					</View>
					<View style={styles.menuListItem}>
						<Image style={styles.menuListItemIcon} source={require("../../themes/assets/icons/ic_info_outline_black_24px.png")}/>
						<Text style={styles.menuListItemText}>关于MonkeyKingPlus</Text>
					</View>
					<View style={styles.menuListItem}>
						<Image style={styles.menuListItemIcon} source={require("../../themes/assets/icons/ic_exit_to_app_black_24px.png")}/>
						<Text style={styles.menuListItemText}>退出</Text>
					</View>
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