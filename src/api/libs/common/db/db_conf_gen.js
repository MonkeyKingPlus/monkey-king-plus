//var db = require('../db_mssql_q')();
//var fs = require('fs');
//var hogan = require("hogan.js");
//
//var mTableName;
//var mReadDBName = 'read';
//var mWriteDBName = 'write';
//
//
//(function() {
//	var args = process.argv.splice(2);
//	if (args && args.length > 0) {
//        var templateText = fs.readFileSync(__dirname + "/db_conf_script.template", "utf-8");
//		generate(args[0],templateText);
//	} else {
//		console.log("Usage: node db_conf_generator.js TABLE_NAME");
//	}
//}());
//
//function generate(tableName, templateText) {
//	mTableName = tableName;
//
//	db.executeSql({
//		db: "write",
//		sql: "SELECT s.name,s.length, s.isnullable, s.xprec, s.xscale, tb.name AS 'dbtype' from sysColumns s INNER JOIN SYS.TYPES tb on tb.user_type_id = s.xusertype where s.id = object_id('" + tableName + "')"
//	}).then(function(data) {
//		if (data && data.length > 0) {
//            var content = {
//                sqlList:[]
//            };
//            content.sqlList.push(getSelectSql(data));
//            content.sqlList.push(getInsertSql(data));
//            content.sqlList.push(getUpdateSql(data));
//
//            var template = hogan.compile(templateText);
//            var output = template.render(content);
//			writeToFile(output);
//		} else {
//			console.log("Invalid table " + tableName);
//		}
//	}).fail(function(err) {
//		console.error(err);
//	}).done();
//}
//
//
//function writeToFile(sql) {
//	var fileName = "db_" + mTableName.replace('dbo.', "") + ".js";
//
//	if (fs.existsSync(fileName)) {
//		console.error("File " + fileName + " already exists.");
//	} else {
//		fs.writeFile(fileName, sql, function(err) {
//			if (err) {
//				console.error(err);
//			} else {
//				console.log("File " + fileName + " generated.")
//			}
//		});
//	}
//}
//
//function getSelectSql(rows) {
//	var array = [];
//	for (var i = 0; i < rows.length; i++) {
//		var row = rows[i];
//		array.push(row.name);
//	}
//	var sql = "SELECT " + array.join(',\r\n\t') + " \r\nFROM " + mTableName + " WITH(NOLOCK)";
//
//	var result = {};
//    result.name = "get";
//	result.db = mReadDBName;
//	result.sql = sql;
//    result.sqlListdot = ",";
//
//	return result;
//}
//
//function getUpdateSql(rows) {
//	var sql = "UPDATE " + mTableName + " \r\nSET";
//
//	for (var i = 0; i < rows.length; i++) {
//		var row = rows[i];
//		sql += " " + row.name + "=@" + row.name + ",\r\n\t";
//	}
//
//	sql = sql.substring(0, sql.length - 1);
//    var inputParams = genInputParams(rows);
//
//	var result = {};
//    result.name = "update";
//	result.db = mWriteDBName;
//	result.sql = sql;
//	result.inputParams = inputParams;
//    result.sqlListdot = "";
//
//	return result;
//}
//
//function getInsertSql(rows) {
//	var array = [];
//	var array2 = [];
//	for (var i = 0; i < rows.length; i++) {
//		var row = rows[i];
//		array.push(row.name);
//		array2.push("@" + row.name);
//	}
//	var sql = "INSERT INTO " + mTableName + " \r\n(" + array.join(',\r\n\t') + ") \r\nVALUES(" + array2.join(',\r\n\t') + ")";
//	var inputParams = genInputParams(rows);
//
//	var result = {};
//    result.name = "insert";
//	result.db = mWriteDBName;
//	result.sql = sql;
//	result.inputParams = inputParams;
//    result.sqlListdot = ",";
//	return result;
//}
//
//function genInputParams(rows){
//    var inputParams = [];
//    for (var i = 0; i < rows.length; i++) {
//        var row = rows[i];
//
//        inputParams.push({
//            name: row.name,
//            type: convertType(row),
//            inputParamsdot: rows.length-1 === i ? "":","
//        });
//    }
//    return inputParams;
//}
//
//function convertType(row) {
//    var dbType = row.dbtype;
//    var length = row.length;
//    var xprec = row.xprec;
//    var xscale = row.xscale;
//
//	var processLength = function(len) {
//		if (len === -1) {
//			return "dbType.MAX";
//		}
//		return len;
//	}
//
//	switch (dbType) {
//		case 'int':
//			return "dbType.Int";
//			break;
//		case 'nchar':
//			return "dbType.NChar(" + processLength(length) + ")";
//			break;
//		case 'nvarchar':
//			return "dbType.NVarChar(" + processLength(length) + ")";
//			break;
//		case 'char':
//			return "dbType.Char(" + processLength(length) + ")";
//			break;
//		case 'varchar':
//			return "dbType.VarChar(" + processLength(length) + ")";
//			break;
//		case 'bit':
//			return "dbType.Bit";
//			break;
//		case 'decimal':
//			return "dbType.Decimal(" +xprec +"," + xscale + ")";
//			break;
//		case 'money':
//			return "dbType.Money";
//			break;
//		case 'float':
//			return "dbType.Float";
//			break;
//		case 'text':
//			return "dbType.Text";
//			break;
//		case 'ntext':
//			return "dbType.NText";
//			break;
//		case 'xml':
//			return "dbType.Xml";
//			break;
//		case 'time':
//			return "dbType.Time";
//			break;
//		case 'date':
//			return "dbType.Date";
//			break;
//		case 'datetime':
//			return "dbType.DateTime";
//			break;
//		case 'datetimeoffset':
//			return "dbType.DateTimeOffset";
//			break;
//		case 'smalldatetime':
//			return "dbType.SmallDateTime";
//			break;
//		case 'uniqueidentifier':
//			return "dbType.UniqueIdentifier";
//			break;
//		case 'binary':
//			return "dbType.Binary";
//			break;
//		case 'varbinary':
//			return "dbType.VarBinary(" + processLength(length) + ")";
//			break;
//		default:
//			throw new Error("Invalid db type:" + dbType);
//	}
//
//}