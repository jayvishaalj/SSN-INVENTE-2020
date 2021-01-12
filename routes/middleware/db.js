var mysql = require("mysql");
var logger = require("../../config/logger")(module);
var pool = mysql.createPool({
  connectionLimit: 20,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
});
pool.on("connection", function (connection) {
  connection.query("SET SESSION auto_increment_increment=1");
});
pool.getConnection(function (err, connectionNode) {
  if (err) {
    logger.log("DB CONNECT error", `${err}`);
    return;
  } // not connected!
});
module.exports = pool;
