var mysql = require('mysql');

var con = mysql.createPool({
    host: "localhost",
    user: "OVIJIT",
    password: "system",
    database: "worldcup2022",
});
 

module.exports = con;