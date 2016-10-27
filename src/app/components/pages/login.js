/**
 * Created by yzw on 2016/10/24.
 */

import BasePage from "./basePage";
import {View,Text,TouchableOpacity,Image,Alert,Platform} from "react-native";
import {viewStyles,textStyles,bgColorStyles} from "../../themes/default";

import {Weibo, Weixin, QQ} from 'react-native-social-kit';
import MKPLoadImageView from "mkp-react-native-image-view";
import {getWeiboUserInfo,loginWithThirdParty} from  "../../actions/login.action"
import {connect} from "react-redux";

import Error from "../elements/error";
import NetworkStatus from "../elements/networkStatus";

const wechatAppID = 'wx458c8642c3333940';
const weiboAppKey = '728211063';
const iosQQAppID = '1105759388';
const androidQQAppID = '1105764592';

import {isLogin} from "../../actions/login.action"



@connect(({loginReducer})=>{
    return {
        ...loginReducer
    }
})
export default class Login extends BasePage{
    
    constructor(props){
        super(props);

        this.QQRegInfo = {};
        this.WeChatRegInfo={};
        this.WeiBoRegInfo = {};

        if(Platform.OS === 'ios'){
            QQ.registerApp(iosQQAppID,(info)=>{
                this.QQRegInfo = Object.assign({}, info);
            })
        }


        Weixin.registerApp(weiboAppKey,(info)=>{
            this.WeChatRegInfo = Object.assign({}, info);
            //console.log("微信 ：",info)
        })

        Weibo.registerApp(weiboAppKey,(info)=>{
            this.WeiBoRegInfo = Object.assign({}, info);
            // console.log("微博 ：",info)
        })

    }


    clickWechat(){

        this.props.dispatch(loginWithThirdParty("111","222","333",4,(res)=>{

        }))
        // Weixin.authorize(null, (data) => {
        //
        // })
    }
    clickQQ(){

        if(Platform.OS === 'ios'){
            QQ.authorize(null, (data) => {

                if(!data.cancel && !data.error){
                    this.props.dispatch(loginWithThirdParty(data.openId,data.nickname,data.figureurl_qq_2,4,(res)=>{

                        this.props.navigator.$replace("home");
                    }))
                }
            })
        }
        else if(Platform.OS === 'android'){
            QQ.authorize({appId:androidQQAppID,scope:'all'}, (data) => {

                if(!data.cancel && !data.error){
                    this.props.dispatch(loginWithThirdParty(data.openId,data.nickname,data.figureurl_qq_2,4,(res)=>{
                        this.props.navigator.$replace("home");
                    }))
                }
            })
        }

    }
    clickSina(){

        Weibo.authorize({scope: "all",redirectUrl:'https://api.weibo.com'}, (data) => {

            if(!data.cancel && !data.error){
            this.props.dispatch(getWeiboUserInfo(data.uid,data.accessToken,(userInfo)=>{

                if(userInfo){
                    this.props.dispatch(loginWithThirdParty( String(userInfo.id),userInfo.name,userInfo.avatar_large,2,(res)=>{
                        console.log("新浪登录成功")
                        this.props.navigator.$replace("home");
                    }))
                }

            }))
            }
        })
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
            <Error/>
            <NetworkStatus/>
        </View>
    }
}
