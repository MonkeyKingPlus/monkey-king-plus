import Drawer from 'react-native-drawer';
import BaseElement from "./baseElement";
import {connect} from "react-redux";
import Menu from "./menu";

@connect(({menu})=>menu)
export default class DrawerWithRedux extends BaseElement {
	render() {
		return (
			<Drawer
				type="overlay"
				openDrawerOffset={100}
				open={this.props.open}
				content={<Menu/>}>
				{this.props.children}
			</Drawer>
		);
	}
}
