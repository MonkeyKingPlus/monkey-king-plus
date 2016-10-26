/**
 * Created by yzw on 2016/10/25.
 */


import {setToken,token,setMyInfo,myInfo} from "../utility/helper";




export function getWeiboUserInfo(uid,accessToken,callback){

    return function(dispatch){
        let conf={
                url: $config.weboUserInfoUrl,
                data: {
                    uid:uid,
                    access_token:accessToken
                },
                ignoreHost:true
            };
            return $req(conf,dispatch).then(res=>{

                if(callback){
                    callback(res);
                }
            }).catch(err=>{
        });
    }
}


/* 第三方登录
 *identifier  用户唯一标识 ,
 * name 昵称 ,
 * avatar 头像,
 * type 认证类型,0=微信;1=微博;2=手机;3=邮箱 ,
 *
 */
export const ACTION_LOGIN_SUCCESS = "ACTION_LOGIN_SUCCESS";
export const ACTION_LOGOUT = "ACTION_LOGOUT";

export function loginWithThirdParty(identifier,name,avatar,type,callback) {


    return function(dispatch){
        let conf={
            url: "/login/thirdparty",
            type: "post",
            data: {
                Identifier: identifier,
                IdentityType:type,
                IsThirdParty:true,
                NickName:name,
                Avatar:avatar
            },
            headers:{
                "content-type":"application/json",
                "accept":"application/json; charset=utf-8"
            }
       };
        return $req(conf,dispatch).then(res=>{

            if(res.Code === 0){//登录成功

                setToken(res.header['x-mkp-authentication']);
                setMyInfo(res.Data);
                dispatch({
                    type:LOGIN_IN_SUCCESS
                });
            }
            if(callback){
                callback(res);
            }

        });
    }
}


export function isLogin(){
    return function (dispatch){
        return token().then((value)=>{

            let isLogin =  value && value.length>0?true:false;
            if(isLogin){
                dispatch({
                    type:LOGIN_IN_SUCCESS
                });
            }
            else{
                dispatch({
                    type:LOGIN_OUT
                });
            }
        })
    }
}


