var express = require('express');
var router = express.Router();

router.use('/movies', require('./movies'));
router.use('/users', require('./users'));
router.use('/register', require('./register'));

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'API v1 - movies, users, register' });
});

module.exports = router;