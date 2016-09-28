var util = require('util');
var os = require('os');
var restClient = require('../rest_client')();
var IP = getIPAddress();

function appender(config, layout) {
    layout = layout || basicLayout;
    return function (loggingEvent) {
        var log = layout(loggingEvent);
        restClient.post(config.serviceAddress, log, null, function (error) {
            if (error) {
                console.log("call service " + config.serviceAddress + " error. " + error);
            }
        });
    };
}

function configure(config) {
    var layout;
    if (config.layout) {
        layout = layouts.layout(config.layout.type, config.layout);
    }
    return appender(config, layout);
}

function basicLayout(loggingEvent) {
    var log = formatLogData(loggingEvent.data);
    var msg = {
        CategoryName: "sotao-website",
        SubCategoryName: loggingEvent.categoryName,
        Content: log.content,
        LogUserName: "sotao-website",
        ServerIP : IP,
        ServerName : os.hostname() || IP,
        LogCreateDate : new Date()
    };

    if (log.extendedProperties) {
        msg.ExtendedProperties = log.extendedProperties;
    }
    return msg;
}

function formatLogData(logData) {
    var data = Array.isArray(logData) ? logData : Array.prototype.slice.call(arguments);
    return wrapErrorsWithInspect(data);
}

function wrapErrorsWithInspect(items) {
    var formatLog = function (item) {
        if ((item instanceof Error) && item.stack) {
            var msg = item.message +  '\r\n' + item.stack;

            var errorContextMsg = "";
            for (var p in item) {
                errorContextMsg += p + ":" + JSON.stringify(item[p]) + "; ";
            }

            return msg + "\r\n" + errorContextMsg;
        } else if (typeof item === "string") {
            return item;
        } else {
            return JSON.stringify(item);
        }
    };

    var convertProperties = function (item) {
        if (item) {
            var properties = [];
            for (var propertyName in item) {
                properties.push({
                    "Key": propertyName,
                    "Value": formatLog(item[propertyName])
                });
            }
            return properties;
        }
    };

    var log = {
        content: "",
        extendedProperties: null
    };

    if (items.length === 2 && (typeof items[0] === "string") && (items[1] instanceof Object)) {
        log.content = formatLog(items[0]);
        log.extendedProperties = convertProperties(items[1]);
    } else {
        items.forEach(function (item) {
            log.content += formatLog(item) + " ";
        });
    }
    return log;
}

function getIPAddress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }
    return '0.0.0.0';
}

exports.appender = appender;
exports.configure = configure;
