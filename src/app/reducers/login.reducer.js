/**
 * Created by yzw on 2016/10/26.
 */

import {ACTION_LOGIN_SUCCESS,ACTION_LOGOUT} from "../actions/login.action";



const initialState={
    $isLogin:null,
};

export default function reducer(state = initialState, action = {}) {
   // console.log("收到reucer",action)
    switch (action.type) {
        case ACTION_LOGIN_SUCCESS:{

            return {
                $isLogin:true,
            };
        }

        case ACTION_LOGOUT:
            return {
                $isLogin:false
            };
        default:
            return state;
    }
}