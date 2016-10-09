import BaseComponent from "../baseComponent";
import {cleanError} from "../../actions/error.action";

export default class BasePage extends BaseComponent{

	$cleanError(){
		if(this.props.dispatch){
			this.props.dispatch(cleanError());
		}
	}

}