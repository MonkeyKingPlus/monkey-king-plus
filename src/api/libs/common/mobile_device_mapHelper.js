/**
 * Created by Administrator on 2015/7/29.
 */


/*
* ex.: Sotao iPhone App/v2.1.0.2;iPhone7,1;8.4
* what I need is iPhone7,1
* */
function mapIPhone(uagent){
    var mapArr = uagent.split(";");
    if(mapArr.length > 1){
        switch(mapArr[1]){
            case "iPhone1,1":return "iPhone 2G";
            case "iPhone1,2":return "iPhone 3G";
            case "iPhone2,1":return "iPhone 3GS";
            case "iPhone3,1":return "iPhone 4";
            case "iPhone3,2":return "iPhone 4";
            case "iPhone3,3":return "iPhone 4";
            case "iPhone4,1":return "iPhone 4S";
            case "iPhone5,1":return "iPhone 5";
            case "iPhone5,2":return "iPhone 5";
            case "iPhone5,3":return "iPhone 5C";
            case "iPhone5,4":return "iPhone 5C";
            case "iPhone6,1":return "iPhone 5S";
            case "iPhone6,2":return "iPhone 5S";
            case "iPhone7,1":return "iPhone 6 Plus";
            case "iPhone7,2":return "iPhone 6";
            case "iPhone8,1":return "iPhone 6S";
            case "iPhone8,2":return "iPhone 6S Plus";

            case "iPod1,1":return "iPod Touch (1 Gen)";
            case "iPod2,1":return "iPod Touch (2 Gen)";
            case "iPod3,1":return "iPod Touch (3 Gen)";
            case "iPod4,1":return "iPod Touch (4 Gen)";
            case "iPod5,1":return "iPod Touch (5 Gen)";

            case "iPad1,1":return "iPad (WiFi)";
            case "iPad1,2":return "iPad 3G";
            case "iPad2,1":return "iPad 2 (WiFi)";
            case "iPad2,2":return "iPad 2 (GSM)";
            case "iPad2,3":return "iPad 2 (CDMA)";
            case "iPad2,4":return "iPad 2 (WiFi Rev. A)";
            case "iPad2,5":return "iPad Mini (WiFi)";
            case "iPad2,6":return "iPad Mini (GSM)";
            case "iPad2,7":return "iPad Mini (CDMA)";
            case "iPad3,1":return "iPad 3 (WiFi)";
            case "iPad3,2":return "iPad 3 (CDMA)";
            case "iPad3,3":return "iPad 3 (Global)";
            case "iPad3,4":return "iPad 4 (WiFi)";
            case "iPad3,5":return "iPad 4 (CDMA)";
            case "iPad3,6":return "iPad 4 (Global)";
            case "iPad4,1":return "iPad Air (WiFi)";
            case "iPad4,2":return "iPad Air (WiFi+GSM)";
            case "iPad4,3":return "iPad Air (WiFi+CDMA)";
            case "iPad4,4":return "iPad Mini Retina (WiFi)";
            case "iPad4,5":return "iPad Mini Retina (WiFi+CDMA)";

            case "i386" :return "Simulator";
            case "x86_64":return "Simulator";
        }
    }

    return "";
}

function mapAndroid(uagent){
    var mapArr = uagent.split(";");
    if(mapArr.length > 1){
        return mapArr[1];
    }
    return "";
}

exports.getDeviceModel = function(clientInfo,userAgent){
    if(/\s*iPhone/ig.test(clientInfo)){
        return mapIPhone(userAgent);
    }else if(/\s*Android/ig.test(clientInfo)){
        return mapAndroid(userAgent);
    }else if(/Sotao\s*Web/ig.test(clientInfo)){
        return "sotao.com";
    }else if(/Sotao\s*CMS/ig.test(clientInfo)){
        return "搜淘网";
    }
};
//exports.getiPhoneDeviceModel = mapIPhone;
//exports.getAndroidDeviceModel = mapAndroid;