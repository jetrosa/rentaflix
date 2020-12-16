const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "jetrosa",
    password: "jetrosa",
    database: "rentaflix"
});

exports.get = function() {
    return con;
};