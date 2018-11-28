var express = require('express');
var chalkboard = require('../controller/chalkboard');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('chalkboard', { title: 'Express' });
});

router.get('/game/:game_id', chalkboard.apidata);

module.exports = router;
