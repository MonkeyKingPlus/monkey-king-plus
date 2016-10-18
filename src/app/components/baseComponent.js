import React, {Component} from "react";
import {DeviceEventEmitter} from "react-native";
import {TOGGLE_MENU} from "./elements/menu";
import {cleanError,businessError} from "../actions/error.action";

window.React = React;

export default class BaseComponent extends Component {

	$cleanError(){
		if(this.props.dispatch){
			this.props.dispatch(cleanError());
		}
	}

	$throwBusinessError(...args){
		if(this.props.dispatch){
			this.props.dispatch(businessError(...args));
		}
	}

	$updateState(obj={},cb=()=>{}){
		this.setState(Object.assign({},obj),cb);
	}

	$toggleMenu(value){
		DeviceEventEmitter.emit(TOGGLE_MENU,value);
	}

}