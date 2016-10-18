import BaseComponent from "../baseComponent";
import BasePage from "./basePage";
import {View, Text, TouchableHighlight, Image, StyleSheet} from "react-native";
import {viewStyles, textStyles, margin, padding, navigationStyles, colors} from "../../themes/default";
import Error from "../elements/error";
import {businessError} from "../../actions/error.action";
import {connect} from "react-redux";
import df from "dateformat";
import {toggleMenu} from "../../actions/menu.action";

@connect()
export default class Home extends BasePage {

	sceneDidFocus() {
		this.props.navigator.$refreshNavBar({
			renderLeftButton: ()=> {
				return (
					<TouchableHighlight
						onPress={event=> {
							this.props.dispatch(toggleMenu());
						}}
						style={[navigationStyles.base, navigationStyles.leftButton]}>
						<Image source={require("../../themes/assets/menu.png")}/>
					</TouchableHighlight>
				);
			}
		})

	}

	render() {
		return (
			<View style={[viewStyles.main, {...padding(16, 10, 0, 10)}]}>
				<Text style={textStyles.link}
					  onPress={event=> {
						  this.props.navigator.$push("register");
					  }}>go to Register</Text>
				<Text style={textStyles.link}
					  onPress={event=> {
						  this.$cleanError();
						  this.props.navigator.$push("demo");
					  }}>go to Demo</Text>
				<Text style={textStyles.button}
					  onPress={event=> {
						  //this.$throwBusinessError(this.route.focus);
						  this.$throwBusinessError(`${df(new Date(), "yyyy-mm-dd HH:MM:ss")}business error`)
					  }}>business error</Text>
				<Text style={textStyles.button}
					  onPress={event=> {
						  this.props.navigator.$refreshNavBar({
							  hideNavigationBar: true
						  })
					  }}>toggle navigation bar</Text>
				<Error/>
			</View>
		);
	}
}