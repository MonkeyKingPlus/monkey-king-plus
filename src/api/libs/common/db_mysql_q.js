'use strict';
var db = require('mysql');
var Q = require('q');
var util = require('util');

var _ = require("underscore");

var logger = require("./logger")("db_mysql_q");
var helper = require("./helper");

var dbConfigs;
var DEBUG;

function doLog(start, sqlObj, inputParameters) {
    if (DEBUG) {
        var elapsed = new Date() - start;
        var msg;
        if (inputParameters) {
            msg = util.format("sql: %s, input parameters: %s, elapsed: %s ms", sqlObj.sql, JSON.stringify(inputParameters), elapsed);
        } else {
            msg = util.format("sql: %s, elapsed: %s ms", sqlObj.sql, elapsed);
        }
        logger.info(msg);
    }
}

function getConnectionConf(dbName) {
    if(typeof dbName === 'string'){
        return  dbConfigs[dbName][0];
    }else{
        return dbName;
    }
}

function openConnection(dbName) {
    var deferred = Q.defer();
    var start = new Date();
    var connection = new db.createConnection(getConnectionConf(dbName));
    connection.connect(function (err) {
        if (err) {
            closeConnection(connection);
            deferred.reject(err);
        } else {
            deferred.resolve(connection);
        }

        if (DEBUG) {
            var elapsed = new Date() - start;
            logger.info(util.format("openDBConnection elapsed: %s ms", elapsed));
        }
    });

    return deferred.promise;
}

function closeConnection(connection) {
    if (connection.end) {
        connection.end();
    }
}

function beginTransaction(dbName) {
    var deferred = Q.defer();
    openConnection(dbName).then(function (connection) {
        connection.beginTransaction(function(err){
            if (err) {
                closeConnection(connection);
                deferred.reject(err);
            } else {
                deferred.resolve(connection);
            }
        });
    });
    return deferred.promise;
}

function executeTransactionPromise(dbName, promiseFunction) {
    var deferred = Q.defer();

    Q().then(function () {
        return beginTransaction(dbName);
    }).then(function (tran) {
        return Q().then(function () {
            return promiseFunction(tran);
        }).then(function () {
            tran.commit(function (err) {
                if (err) {
                    tran.rollback();
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
                closeConnection(tran);
            });
        }).fail(function (err) {
            tran.rollback();
            closeConnection(tran);
            deferred.reject(err);
        });
    });

    return deferred.promise;
};

function query(connection, sqlObj) {
    var deferred = Q.defer();

    var start = new Date();

    connection.query(sqlObj, function (err, recordset) {
        closeConnection(connection);

        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(recordset);
        }

        doLog(start, sqlObj);
    });

    return deferred.promise;
}

function queryTran(tran,sqlObj){
    var deferred = Q.defer();

    var start = new Date();

    tran.query(sqlObj, function (err, recordset) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(recordset);
        }

        doLog(start, sqlObj);
    });

    return deferred.promise;
}

function SqlClient() {}

SqlClient.prototype.executeSql = function (sqlObj,values) {
    if (!sqlObj) {
        throw new Error("can not found sql key in sql config file.");
    }

    return openConnection(sqlObj.db).then(function (connection) {
        return query(connection, _.extend(sqlObj,{values:values}));
    });
};

SqlClient.prototype.executeSqlOne = function (sqlObj, parameters) {
    return this.executeSql(sqlObj, parameters)
        .then(function (data) {
            if (data && data.length > 0) {
                return data[0];
            } else {
                return null;
            }
        });
};

SqlClient.prototype.executeTran = function (transaction, sqlObj, values) {
    if (!sqlObj) {
        throw new Error("can not found sql key in sql config file.");
    }

    return queryTran(transaction, _.extend(sqlObj,{values:values}));
};

SqlClient.prototype.beginTran = beginTransaction;

SqlClient.prototype.executeTranPromise = executeTransactionPromise;

module.exports = function (config) {
    dbConfigs = config || require('./config.js').db;
    DEBUG = dbConfigs.debug || false;

    return new SqlClient();
};
