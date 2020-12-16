const con = require('./db.js');

module.exports = function connect(res, sql) {
    con.get().query(sql, function (err, result) {
        if (err) {
            console.log(err);
            //TODO: change err msg for production
            res.status(500).send({error: err, message: err.message}); // 500
        }
        res.json(result);
    });
};