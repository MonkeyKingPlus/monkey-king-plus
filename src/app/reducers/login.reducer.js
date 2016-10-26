/**
 * Created by yzw on 2016/10/26.
 */

import {ACTION_LOGIN_SUCCESS,ACTION_LOGOUT} from "../actions/login.action";



const initialState=createInitialState({
    $isLogin:false,
});

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case ACTION_LOGIN_SUCCESS:
            return {
                ...state,
                $isLogin:true
            };
        case ACTION_LOGOUT:
            return {
                ...state,
                $isLogin:false
            };
        default:
            return state;
    }
}