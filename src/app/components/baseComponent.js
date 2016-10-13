import React, {Component} from "react";
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

}