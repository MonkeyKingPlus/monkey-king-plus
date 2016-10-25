/**
 * Created by yzw on 2016/10/25.
 */

export function getWeiboUserInfo(uid,accessToken,callback){

    console.log("微博用户请求开始=====1")

    return function(dispatch){

        console.log("微博用户请求开始=====2")

        let conf={
                url: "https://api.weibo.com/2/users/show.json",
                //type: "GET",
                data: {
                    uid:uid,
                    access_token:accessToken
                }
            };
            return $req(conf,dispatch).then(res=>{

                console.log("微博用户请求开始=====3")

                if(callback){
                    callback(res);
                }
            }).catch(err=>{
                console.log("微博用户请求开始=====4")
        });
        }
    }