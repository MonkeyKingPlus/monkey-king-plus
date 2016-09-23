import BasePage from "./basePage";
import {View,Text,Navigator} from "react-native";

export default class Home extends BasePage{
	render(){
		return <View style={{justifyContent:"center",flex:1,alignItems:"center"}}>
			<Text>Home</Text>
			<Text onPress={event=>{
				this.props.navigator.push({title:"sub"});
			}}>go to sub</Text>
		</View>;
	}
}