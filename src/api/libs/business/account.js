var accountDb = require('../db_conf/db_account.js');
var db = require('../common/db_mysql_q.js')();
var businessError = require('../common/businesserror.js');

exports.test = function (id) {
    return db.executeSql(accountDb.test, [id]);
}

exports.insertTest = function (name) {
    return db.executeSql(accountDb.insertTest, [name]);
}

exports.insertTestWillRollback = function (name) {
    return db.executeTranPromise(accountDb.insertTest.db,
        function (trans) {
            return db.executeTran(trans, accountDb.insertTest, [name])
                .then(function () {
                    return db.executeTran(trans, accountDb.insertTestRollback, ["Transaction is not working when you see this message!"])
                })
        }
    ).fail(function (err) {
        console.log(err);
        throw new businessError("操作异常,数据已回滚")
    })
}

exports.login = function (loginName, password) {
    return db.executeSqlOne(accountDb.login, [loginName, password]);
}

exports.getUserInfo = function (id) {
    return db.executeSqlOne(accountDb.getUserInfo, [id]);
}