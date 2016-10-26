/**
 * Created by yzw on 2016/10/25.
 */


import {setToken,token} from "../utility/helper";


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

        console.log("conf = ",conf);
        return $req(conf,dispatch).then(res=>{

            console.log("login : ",res)
            if(callback){
                callback(res);
            }
        }).catch(err=>{

            console.log("login failed: ",err)
        });
    }
}


export function isLogin(callBack){
    return function (dispatch){
        return token().then((value)=>{
            if(callBack){
                callBack(value && value.length>0?true:false)
            }
        })
    }
}


