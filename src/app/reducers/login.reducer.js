/**
 * Created by yzw on 2016/10/26.
 */

import {ACTION_LOGIN_SUCCESS,ACTION_LOGOUT} from "../actions/login.action";



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
        default:
            return state;
    }
}