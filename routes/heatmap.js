var express = require('express');
var heatmap = require('../controller/heatmap');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('heatmap', { title: 'Express' });
});

router.get('/game/:game_id', heatmap.apidata);

module.exports = router;
