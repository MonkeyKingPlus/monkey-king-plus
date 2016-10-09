import BaseElement from "./baseElement";
import {View, StyleSheet, Text} from "react-native";
import {connect} from "react-redux";
import * as Animatable from 'react-native-animatable';
import {cleanError} from "../../actions/error.action";

const styles = StyleSheet.create({
	notify: {
		position: "absolute",
		zIndex: 999,
		left: 0,
		right: 0,
		bottom: 0
	},
	notifyItem: {
		flex: 1,
		textAlign:"center"
	}
});

@connect(({errors})=> {
	return {
		...errors
	}
})
class Notify extends BaseElement {

	delayRefresh(props) {
		if (props.errors.length > 0) {
			let first = props.errors.find(item=>item.$expire > Date.now());
			if (first) {
				let timeout = first.$expire - Date.now();
				console.log(timeout);
				setTimeout(()=> {
					this.forceUpdate();
				}, timeout);
			}
		}
	}

	componentDidMount() {
		this.delayRefresh(this.props);
	}

	componentDidUpdate() {
		this.delayRefresh(this.props);
	}

	// componentWillReceiveProps(nextProps){
	// 	console.log("next props : ",nextProps);
	// 	this.delayRefresh(nextProps);
	// }

	render() {
		return (
			<View style={styles.notify}>
				{this.props.errors.map((item, index)=> {
					if (item.$expire > Date.now()) {
						return <Animatable.Text style={styles.notifyItem} animation="bounceIn" key={index}>{item.message}</Animatable.Text>
					}
					return <Animatable.Text style={styles.notifyItem} animation="bounceOut" key={index}>{item.message}</Animatable.Text>
				})}
			</View>
		);
	}

	componentWillUnmount() {
		this.props.dispatch(cleanError());
	}
}

export default Notify;