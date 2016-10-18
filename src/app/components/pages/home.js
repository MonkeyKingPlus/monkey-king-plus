import BasePage from "./basePage";
import BaseElement from "../elements/baseElement";
import {View, Text, TouchableHighlight, Image, StyleSheet, DeviceEventEmitter} from "react-native";
import {
	viewStyles, textStyles, margin, padding, navigationStyles,
	fontSizes,
	colors
} from "../../themes/default";
import Error from "../elements/error";
import {businessError} from "../../actions/error.action";
import {connect} from "react-redux";
import df from "dateformat";

const styles = StyleSheet.create({
	homeView: {
		...padding(16, 10, 0, 10),
		backgroundColor: "#f6f6f6"
	},
	itemView: {
		...margin(0,0,10,0),
		backgroundColor: "#fafafa",

		borderWidth: 1,
		borderRadius: 2,
		borderColor: "rgba(0,0,0,0.12)",

		shadowColor: "#000000",
		shadowOpacity: 0.2,
		shadowRadius: 1,
		shadowOffset: {
			height: 2,
			width: 0
		}
	},
	itemTitleView: {
		flexDirection: "row",
		...margin(0,16),
		...padding(16,0),
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.12)"
	},
	itemTitle: {
		fontSize: fontSizes.ft16,
		flex: 0.5,
		fontWeight: "bold",
		lineHeight: 16,
	},
	itemFrom: {
		fontSize: fontSizes.ft14,
		flex: 0.5,
		textAlign: "right",
		lineHeight: 16
	},
	itemContentView: {
		...padding(10,16)

	},
	itemContentText: {
		// letterSpacing: 1.3,
		fontSize: fontSizes.ft14,
		lineHeight: 19.8
	},
	itemRichTitleView: {
		height: 176,
		overflow: "hidden"
	},
	itemRichTitleImage: {},
	itemRichTitleSubView: {
		position: "absolute",
		bottom: 0,
		...padding(10,16),
		flexDirection: "row",
		backgroundColor: "rgba(2,1,1,0.4)"
	},
	itemRichTitle: {
		flex: 0.5,
		fontSize: fontSizes.ft16,
		lineHeight: 16,
		color: colors.white
	},
	itemRichTitleAuthor: {
		flex: 0.5,
		textAlign: "right",
		fontSize: fontSizes.ft14,
		lineHeight: 16,
		color: colors.white
	},
});

class ItemRichTitle extends BaseElement {
	render() {
		return (
			<View style={styles.itemRichTitleView}>
				<Image style={styles.itemRichTitleImage} source={require("../../themes/assets/temp/bg.png")}/>
				<View style={styles.itemRichTitleSubView}>
					<Text style={styles.itemRichTitle}>标题</Text>
					<Text style={styles.itemRichTitleAuthor}>作者</Text>
				</View>
			</View>
		);
	}
}

class ItemTitle extends BaseElement {
	render() {
		return (
			<View style={styles.itemTitleView}>
				<Text style={styles.itemTitle}>普通标题</Text>
				<Text style={styles.itemFrom}>来源</Text>
			</View>
		);
	}
}

class ItemContent extends BaseElement {
	render() {
		return (
			<View style={styles.itemContentView}>
				<Text style={styles.itemContentText}>内容看书记得付款数据开发建设的开发快点上几分可怜的会计师的会计法卡洛斯的开始的减肥快结束的看法</Text>
			</View>
		);
	}
}

@connect()
export default class Home extends BasePage {

	sceneDidFocus() {
		this.props.navigator.$refreshNavBar({
			renderLeftButton: ()=> {
				return (
					<TouchableHighlight
						onPress={event=> {
							this.$toggleMenu(true);
						}}
						style={[navigationStyles.base, navigationStyles.leftButton]}>
						<Image source={require("../../themes/assets/icons/menu.png")}/>
					</TouchableHighlight>
				);
			}
		})

	}

	render() {
		return (
			<View style={[viewStyles.main, styles.homeView]}>

				<View style={styles.itemView}>
					<ItemRichTitle/>
					<ItemContent/>
				</View>
				<View style={styles.itemView}>
					<ItemTitle/>
					<ItemContent/>
				</View>
				<Error/>
			</View>
		);
	}
}