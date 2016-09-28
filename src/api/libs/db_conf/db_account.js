var multiline = require('multiline');

module.exports = {
    "test": {
        db: "read",
        sql: multiline(function () {
            /*
             select * from Test where ID = ?
             */
        }),
        timeout: 60000
    },
    "insertTest": {
        db: "read",
        sql: multiline(function () {
            /*
             insert into Test(name) values(?)
             */
        })
    },
    "insertTestRollback": {
        db: "read",
        sql: multiline(function () {
            /*
             inserts into Test(name) values(?)
             */
        })
    },
    "login": {
        "db": "read",
        sql: multiline(function () {
            /*
             select * from User where LoginName = ? And Password = ?
             */
        })
    },
    "getUserInfo": {
        "db": "read",
        sql: multiline(function () {
            /*
             select * from User where ID = ?
             */
        })
    }
};
