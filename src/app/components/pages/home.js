import BasePage from "./basePage";
import {View, Text} from "react-native";
import {viewStyles, textStyles} from "../../themes/default";
import Notify from "../elements/notify";
import {businessError} from "../../actions/error.action";
import {connect} from "react-redux";
import df from "dateformat";

@connect()
export default class Home extends BasePage {
	render() {
		return <View style={[viewStyles.main]}>
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
					  this.props.dispatch(businessError(`${df(new Date(),"yyyy-mm-dd HH:MM:ss")}business error`));
				  }}>business error</Text>
			<Notify/>
		</View>;
	}
}