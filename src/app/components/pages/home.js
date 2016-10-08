import BasePage from "./basePage";
import {View,Text} from "react-native";
import {viewStyles,textStyles} from "../../themes/default";

export default class Home extends BasePage{
	render(){
		return <View style={[viewStyles.main]}>
			<Text style={textStyles.link}
			      onPress={event=>{
			      	this.props.navigator.$push("register");
			      }}>go to Register</Text>
			<Text style={textStyles.link}
				  onPress={event=>{
					  this.props.navigator.$push("demo");
				  }}>go to Demo</Text>
		</View>;
	}
}