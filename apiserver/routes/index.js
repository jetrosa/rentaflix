var express = require('express');
var router = express.Router();

router.use('/v1', require('./v1/index'));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
