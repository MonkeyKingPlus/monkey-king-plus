import BasePage from "./basePage";
import {View,Text} from "react-native";

export default class SubPage extends BasePage{
	render(){
		return <View style={{justifyContent:"center",flex:1,alignItems:"center"}}>
			<Text>Sub Page</Text>
			<Text onPress={event=>{
				this.props.navigator.pop();
			}}>back</Text>
		</View>;
	}
}