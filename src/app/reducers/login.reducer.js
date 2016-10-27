/**
 * Created by yzw on 2016/10/26.
 */

import {ACTION_LOGIN_SUCCESS,ACTION_LOGOUT,UPDATE_MY_USER_INFO,UPDATE_MY_TOKE} from "../actions/login.action";
//import {setToken,setMyInfo,token,myInfo,removeMyInfo,removeToken} from "../utility/helper"

const initialState={
    $isLogin:null,
    token:null,
    myUserInfo:null,
};

export default function reducer(state = initialState, action = {}) {

    switch (action.type) {
        case ACTION_LOGIN_SUCCESS:{

            return {
                $isLogin:true,
                token:action.token,
                myUserInfo:action.myUserInfo,
            };
        }

        case ACTION_LOGOUT:
            return {
                $isLogin:false,
                token:null,
                myUserInfo:null,
            };
        case UPDATE_MY_USER_INFO:
            return {
                ...state,
                myUserInfo:action.myUserInfo,
            };
        case UPDATE_MY_TOKE:{

             return {
                 ...state,
                 $isLogin:action.token?true:false,
                 token:action.token,
            }
        }
        default:
            return state;
    }
}