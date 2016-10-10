import BasePage from "./basePage";
import {View,Text} from "react-native";
import {viewStyles,textStyles,margin} from "../../themes/default";
import {connect} from "react-redux";
import {hideMessage,showMessage,fetchTest,fetchHomeInfo} from "../../actions/demo.action";
import Error from "../elements/error";
import agent from "superagent";

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
		},
		dispatch
	};
})
export default class Demo extends BasePage{
	constructor(props){
		super(props);
		this.state={
			result:null
		};
	}
	render(){
		return <View style={[viewStyles.main]}>
			{this.props.show && <Text>{this.props.message}</Text>}
			<Text style={[textStyles.button,{...margin(5,0)}]}
			      onPress={event=>{
			      	this.props.toggle(this.props.show);
			      }}>Toggle Message</Text>
			<Text style={[textStyles.button,{...margin(5,0)}]} onPress={event=>{
				this.$throwBusinessError("error");
			}}>business error</Text>
			<Text style={[textStyles.button,{...margin(5,0)}]} onPress={event=>{
				this.props.dispatch(fetchTest(data=>{
					this.setState({
						result:data.text
					})
				}))
			}}>{this.state.result?this.state.result : "fetch test"}</Text>
			<Error/>
		</View>;
	}
}