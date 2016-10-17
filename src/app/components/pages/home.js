import BaseComponent from "../baseComponent";
import BasePage from "./basePage";
import {View, Text, TouchableHighlight, Image,StyleSheet} from "react-native";
import {viewStyles, textStyles, margin,padding,navigationStyles,colors} from "../../themes/default";
import Error from "../elements/error";
import {businessError} from "../../actions/error.action";
import {connect} from "react-redux";
import df from "dateformat";
import Drawer from 'react-native-drawer'

const styles=StyleSheet.create({
	drawer:{
		backgroundColor:colors.white,
		flex:1,
	}
});

class DrawerMenu extends BaseComponent {
	render() {
		return (
			<View style={[viewStyles.main, styles.drawer]}>
				<Text style={textStyles.button}>Drawer</Text>
				<Text>Drawer</Text>
				<Text>Drawer</Text>
				<Text>Drawer</Text>
				<Text>Drawer</Text>
				<Text>Drawer</Text>
				<Text>Drawer</Text>
			</View>
		);
	}
}

@connect()
export default class Home extends BasePage {

	constructor(props){
		super(props);
		//hide:0,show:1
		this.menuStatus=0;

	}

	sceneDidFocus() {
		this.props.navigator.$refreshNavBar({
			renderLeftButton: ()=> {
				return (
					<TouchableHighlight
						onPress={event=>{
							this.toggleMenu();
						}}
						style={[navigationStyles.base, navigationStyles.leftButton]}>
						<Image source={require("../../themes/assets/menu.png")}/>
					</TouchableHighlight>
				);
			}
		})

	}

	openMenu(){
		this.refs.menu.open();
		this.menuStatus=1;
	}

	closeMenu(){
		this.refs.menu.close();
		this.menuStatus=0;
	}

	toggleMenu(){
		this.menuStatus=this.menuStatus===0?1:0;
		if(this.menuStatus===0){
			this.refs.menu.close();
		}
		else{
			this.refs.menu.open();
		}
	}

	render() {
		return (
			<Drawer
				type="overlay"
				openDrawerOffset={100}
				ref="menu"
				content={<DrawerMenu/>}>
				<View style={[viewStyles.main,{...padding(16,10,0,10)}]}>
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
								  hideNavigationBar:true
							  })
						  }}>toggle navigation bar</Text>
					<Error/>
				</View>
			</Drawer>
		);
	}
}