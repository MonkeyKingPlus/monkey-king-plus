import BasePage from "./basePage";
import HtmlView from "react-native-htmlview";
import {
	Image
	, View
	, Text
	, StyleSheet
	, TouchableWithoutFeedback
} from "react-native";
import {
	viewStyles
	, margin
	, fontSizes
	, navigationStyles
} from "../../themes/default";

const styles = StyleSheet.create({
	coverImage: {
		height: 184
	},
	subtitle: {
		...margin(10, 0, 10, 10),
		fontSize: fontSizes.ft16,
		fontWeight: "bold"
	},
	content: {
		...margin(0, 10)
	}
});

export default class ArticleDetail extends BasePage {

	sceneDidFocus() {
		this.props.navigator.$refreshNavBar({
			title: "subtitle",
			renderRightButton: ()=> {
				return (
					<TouchableWithoutFeedback>
						<View style={[navigationStyles.base]}>
							<Text style={[navigationStyles.rightButton]}>评论</Text>
						</View>
					</TouchableWithoutFeedback>
				)
			}
		});
	}

	render() {
		return (
			<View style={viewStyles.main}>
				<Image
					source={require("../../themes/assets/temp/bg.png")}
					style={styles.coverImage}/>
				<Text
					style={styles.subtitle}>Title</Text>
				<View style={styles.content}>
					<HtmlView
						value="abc"/>
				</View>
			</View>
		);
	}
}