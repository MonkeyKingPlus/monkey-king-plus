import Drawer from 'react-native-drawer';
import BaseElement from "./baseElement";
import {connect} from "react-redux";
import Menu from "./menu";
import {DeviceEventEmitter} from "react-native";
import * as helper from "../../utility/helper";

export const TOGGLE_MENU="TOGGLE_MENU";

export default class DrawerWithRedux extends BaseElement {
	constructor(props){
		super(props);
		this.open=false;

		DeviceEventEmitter.addListener(TOGGLE_MENU,(value)=>{
			if(helper.hasValue(value)){
				this.open=value;
			}
			else{
				this.open=!this.open;
			}
			if(this.open){
				this.refs.drawer.open();
			}
			else{
				this.refs.drawer.close();
			}
		})

	}
	render() {
		return (
			<Drawer
				ref="drawer"
				type="overlay"
				panOpenMask={100}
				panCloseMask={100}
				openDrawerOffset={100}
				content={<Menu/>}>
				{this.props.children}
			</Drawer>
		);
	}
}
