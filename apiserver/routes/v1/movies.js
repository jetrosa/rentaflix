const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const SqlString = require('sqlstring');
const connect = require('../../dbConnection.js');

//Request all movies
router.get('/', function (req, res) {

    const limit = req.query.limit;
    const searchWords = req.query.title.trim().split(" ");

    let sql;
    if (req.query.title) {
        if (searchWords.length > 1) {
            sql = SqlString.format("SELECT *"
                + " FROM movies"
                + " WHERE title LIKE ? AND title LIKE ?"
                + " ORDER BY movies.title"
                + " LIMIT ?", ['%' + searchWords[0] + '%', '%' + searchWords[1] + '%', parseInt(limit)]);
        } else {
            sql = SqlString.format("SELECT *"
                + " FROM movies"
                + " WHERE title LIKE ?"
                + " ORDER BY movies.title"
                + " LIMIT ?", ['%' + req.query.title + '%', parseInt(limit)]);
        }
    } else {
        sql = SqlString.format("SELECT *"
            + " FROM movies"
            + " ORDER BY movies.title"
            + " LIMIT ?", [parseInt(limit)]);

    }
    console.log(sql);
    connect(res, sql);
});

router.get('/search/actors', function (req, res) {

    const limit = req.query.limit;
    const searchIds = req.query.actors.trim().split(",");

    let sql;

    sql = SqlString.format("SELECT *"
        + " FROM movies, acts_in, actors"
        + " WHERE movies.Id = MovieId AND actors.Id = ActorId AND actors.Id = ?"
        + " ORDER BY movies.title"
        + " LIMIT ?", [parseInt(searchIds[0]), parseInt(limit)]);

    console.log(sql);
    connect(res, sql);
});

router.get('/top', function (req, res) {

    const limit = 10;

    const sql = SqlString.format("SELECT Id, Title, Genre, NumCopies, Count(*)"
        + " FROM movies, orders"
        + " WHERE Id = MovieId"
        + " GROUP BY MovieId"
        + " ORDER BY Count(Id)"
        + " DESC LIMIT ?", [limit]);

    console.log(sql);
    connect(res, sql);
});

router.get('/available', function (req, res) {
    const genre = req.query.genre;
    const limit = 50;

    const sql = SqlString.format("SELECT *"
        + " FROM movies"
        + " WHERE NumCopies > 0 AND genre = '" + genre + "'"
        + " ORDER BY movies.title"
        + " LIMIT ?", [limit]);

    console.log(sql);
    connect(res, sql);
});

/**
 * Get existing movie genre names
 */
router.get('/genres', function (req, res) {
    const sql = SqlString.format("SELECT *"
        + " FROM genre"
    );

    console.log(sql);
    connect(res, sql);
});


module.exports = router;