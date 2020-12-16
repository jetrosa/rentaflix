const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const SqlString = require('sqlstring');
const connect = require('../../dbConnection.js');

/**
 * Retrieve customer's profile information
 */
router.get('/:userId/profile', function (req, res) {

    const sql = SqlString.format("SELECT *"
        + " FROM customers"
        + " WHERE customerId = ?", [req.params.userId]);

    connect(res, sql);
});

/**
 * Update customer's profile information
 */
router.put('/profile', [
        check('CustomerId').isInt()
    ],

    function (req, res) {
        // Finds the validation errors in this request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("post err");
            return res.status(422).json({errors: errors.array()});
        }

        const rb = req.body;
        const sql = SqlString.format("UPDATE customers SET FirstName = ?, LastName = ?, Email = ?" +
            " WHERE CustomerId = ?", [rb.FirstName, rb.LastName, rb.Email, rb.CustomerId]);

        console.log(sql);
        connect(res, sql);
    });

/**
 * Retrieve the movies in customer's queue
 */
router.get('/:userId/queue', function (req, res) {

    const sql = SqlString.format("SELECT *"
        + " FROM movie_queue, movies"
        + " WHERE Id = MovieId AND CustomerId=?", [req.params.userId]);

    connect(res, sql);

});

/**
 * Add a movie to customer's queue
 */
router.post('/:userId/queue', [
        check('userId').isInt(),
        check('movieId').isInt()
    ],
    function (req, res) {
        // Finds the validation errors in this request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("post err");
            return res.status(422).json({errors: errors.array()});
        }

        const dateAdded = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const rb = req.body;
        const sql = SqlString.format("INSERT INTO movie_queue (CustomerId, MovieId, DateAdded)" +
            " VALUES(?,?,?)", [req.params.userId, rb.movieId, dateAdded]);

        connect(res, sql);
    });

/**
 * Delete a movie from customer's queue
 */
router.delete('/:userId/queue/:queueId', [
        check('userId').isInt(),
        check('queueId').isInt()
    ],
    function (req, res) {
        try {

            // Finds the validation errors in this request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log("post err");
                return res.status(422).json({errors: errors.array()});
            }

            console.log(req);
            const sql = SqlString.format("DELETE FROM movie_queue WHERE userId=? AND queueId=?",
                [req.params.userId, req.params.workoutId]);
            connect(res, sql);
        } catch (e) {
            console.log(e);
        }
    });

/**
 * Make a new order (customer rents a movie)
 */
router.post('/:userId/orders', [
        check('userId').isInt()
    ],
    function (req, res) {
        // Finds the validation errors in this request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("post err");
            return res.status(422).json({errors: errors.array()});
        }

        //CHECK CONDITIONS!! current loans, monthly limit
        const rb = req.body;
        const sql = SqlString.format("INSERT INTO movie_queue (userId, movieId)" +
            " VALUES(?,?)", [req.params.userId, rb.movieId]);

        connect(res, sql);
    });

/**
 * Get currently active orders of a customer (including movie information)
 */
router.get('/:userId/orders/active', function (req, res) {

    const sql = SqlString.format("SELECT *"
        + " FROM orders, movies"
        + " WHERE movies.Id = orders.MovieId AND CustomerId = ? AND ReturnDate IS NULL", [req.params.userId]);

    connect(res, sql);
});

/**
 * Get order history of a customer
 */
router.get('/:userId/orders/all', function (req, res) {

    //ADD rating!
    const sql = SqlString.format("SELECT *"
        + " FROM orders, movies"
        + " WHERE movies.Id = orders.MovieId AND CustomerId = ?", [req.params.userId]);

    connect(res, sql);
});

module.exports = router;