/**
 * Created by yzw on 2016/10/25.
 */

import {setToken,setMyInfo,token,myInfo,removeMyInfo,removeToken} from "../utility/helper"

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
                    callback(res.body);
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
export const UPDATE_MY_TOKE = "UPDATE_MY_TOKE";
export const UPDATE_MY_USER_INFO = "UPDATE_MY_USER_INFO";

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

            if(res.body.Code === 0){//登录成功

                setToken(res.header['x-mkp-authentication'])
                setMyInfo(res.body.Data)

                dispatch({
                    type:ACTION_LOGIN_SUCCESS,
                    token:res.header['x-mkp-authentication'],
                    myUserInfo:res.body.Data,
                });
                if(callback){
                    callback(res);
                }
            }
        });
    }
}

export function readLoginInfo() {
    return function (dispatch){

        token().then((value)=>{
             dispatch({type:UPDATE_MY_TOKE,token:value});
        })
        myInfo().then((value)=>{
            dispatch({type:UPDATE_MY_USER_INFO,myUserInfo:value});
        })
    }
}

export function isLogin(callBack) {

    token().then((value)=>{

        if(value && value.length>0){
            callBack(true)
        }
        else{
            callBack(false);
        }
    })
}

export function logout() {
    removeToken();
    removeMyInfo();

    return function (dispatch){
        dispatch({
            type:ACTION_LOGOUT
        });
    }
}



