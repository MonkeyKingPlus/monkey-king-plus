/**
 * Created by yzw on 2016/10/25.
 */

export function getWeiboUserInfo(uid,accessToken,callback){

    return function(dispatch){
        let conf={
                url: $config.weboUserInfoUrl,
                //type: "GET",
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