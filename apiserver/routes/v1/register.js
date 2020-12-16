const express = require('express');
const router = express.Router();
const SqlString = require('sqlstring');
const connect = require('../../dbConnection.js');
const {check, validationResult} = require('express-validator');

router.post('/', [
        check('currentSub').isInt()
    ],
    function (req, res) {
        // Finds the validation errors in this request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("post err");
            return res.status(422).json({errors: errors.array()});
        }

        const rb = req.body;
        const d = new Date();
        const subStart = d.toISOString().slice(0, 19).replace('T', ' ');
        d.setDate(d.getDate() + 30);
        const subEnd = d.toISOString().slice(0, 19).replace('T', ' ');
        const nextSub = rb.currentSub;

        const sql = SqlString.format("INSERT INTO customers (FirstName, LastName, Email, SubStart, SubEnd, CurrentSub, NextSub)" +
            " VALUES(?,?,?,?,?,?,?)", [rb.firstName, rb.lastName, rb.email, subStart, subEnd, rb.currentSub, nextSub]);

        connect(res, sql);
    });

module.exports = router;