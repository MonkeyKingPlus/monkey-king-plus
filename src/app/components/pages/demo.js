import BasePage from "./basePage";
import {View,Text} from "react-native";
import {viewStyles,textStyles} from "../../themes/default";
import {connect} from "react-redux";
import {hideMessage,showMessage} from "../../actions/demo.action";

@connect(({demo})=>{
	return {
		...demo
	}
},dispatch=>{
	return {
		toggle(value){
			if(value){
				dispatch(hideMessage());
			}
			else{
				dispatch(showMessage());
			}
		}
	};
})
export default class Demo extends BasePage{
	render(){
		return <View style={[viewStyles.main]}>
			{this.props.show && <Text>{this.props.message}</Text>}
			<Text style={[textStyles.button]}
			      onPress={event=>{
			      	this.props.toggle(this.props.show);
			      }}>Toggle Message</Text>
		</View>;
	}
}