import BasePage from "./basePage";
import {View,Text,TouchableOpacity} from "react-native";
import {viewStyles,textStyles} from "../../themes/default";

import {Weibo, Weixin, QQ, Ali} from 'react-native-social-kit';
import MKPLoadImageView from "react-native-image-view";

export default class RegisterStep1 extends BasePage{

	constructor(props){
		super(props);

		Weibo.authorize({
			appId: '3928876547',
			redirectUrl: 'https://api.weibo.com/oauth2/default.html'
		}, (data) => {

		})
	}


	clickWechat(){

	}
	clickQQ(){

	}
	clickAlipy(){

	}
	clickSina(){

	}

	render(){

		return <View style={[viewStyles.main]}>
			<Text style={textStyles.button}
			      onPress={event=>{
			      	this.props.navigator.$push("register/step2");
			      }}>next step</Text>

		<MKPLoadImageView
		imageSource={require('../../themes/assets/icons/wechat_s.png')}
		style={{margin:10,width:44,height:44}}
		onPress={this.clickWechat.bind(this)}>
	  </MKPLoadImageView>
		<MKPLoadImageView
		imageSource={require('../../themes/assets/icons/qq_s.png')}
		style={{margin:10,width:44,height:44}}
		onPress={this.clickQQ.bind(this)}>
	</MKPLoadImageView>
		<MKPLoadImageView
		imageSource={require('../../themes/assets/icons/sina_weibo_s.png')}
		style={{margin:10,width:44,height:44}}
		onPress={this.clickSina.bind(this)}>
	</MKPLoadImageView>

		</View>
	}
}

export class RegisterStep2 extends BasePage{
	render(){
		return <View style={[viewStyles.main]}>

		</View>;
	}
}