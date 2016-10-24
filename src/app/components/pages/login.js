/**
 * Created by yzw on 2016/10/24.
 */

import BasePage from "./basePage";
import {View,Text,TouchableOpacity,Image} from "react-native";
import {viewStyles,textStyles,bgColorStyles} from "../../themes/default";

import {Weibo, Weixin, QQ, Ali} from 'react-native-social-kit';
import MKPLoadImageView from "react-native-image-view";


export default class Login extends BasePage{

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
    clickSina(){
        Weibo.authorize({})
    }

    render(){

        return <View style={[viewStyles.main,bgColorStyles.black,{marginTop:0,alignItems:'center'}]}>

            <Image source={require('../../themes/assets/icons/icon.png')} />
            <View style={{flexDirection:'row',marginHorizontal:24}}>
                <View style={{backgroundColor:'#b6b6b6',height:1,marginRight:12,marginTop:6,flex:0.5}}/>
                <Text style={{color:'#b6b6b6',fontSize:12,textAlign:'center'}}>选择以下方式登录</Text>
                <View style={{backgroundColor:'#b6b6b6',height:1,marginLeft:12,marginTop:6,flex:0.5}}/>
            </View>

            <View  style={{flexDirection:'row',alignItems:'center',marginTop:80}}>
            <MKPLoadImageView
                defaultImageSource={require('../../themes/assets/icons/wechat_s.png')}
                style={{}}
                onPress={this.clickWechat.bind(this)}>
            </MKPLoadImageView>
            <MKPLoadImageView
                defaultImageSource={require('../../themes/assets/icons/qq_s.png')}
                style={{marginHorizontal:50}}
                onPress={this.clickQQ.bind(this)}>
            </MKPLoadImageView>
            <MKPLoadImageView
                defaultImageSource={require('../../themes/assets/icons/sina_weibo_s.png')}
                style={{}}
                onPress={this.clickSina.bind(this)}>
            </MKPLoadImageView>
           </View>
            <Image style={{marginTop:71,marginHorizontal:0}} source={require('../../themes/assets/icons/MonkeyPlus.png')}/>
        </View>
    }
}
