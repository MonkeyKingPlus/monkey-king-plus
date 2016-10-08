import BasePage from "./basePage";
import {View,Text} from "react-native";
import {viewStyles,textStyles} from "../../themes/default";

export default class RegisterStep1 extends BasePage{
	render(){
		return <View style={[viewStyles.main]}>
			<Text style={textStyles.button}
			      onPress={event=>{
			      	this.props.navigator.$push("register/step2");
			      }}>next step</Text>
		</View>;
	}
}

export class RegisterStep2 extends BasePage{
	render(){
		return <View style={[viewStyles.main]}>

		</View>;
	}
}