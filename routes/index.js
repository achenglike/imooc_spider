var express = require('express');
var moment = require('moment');
var DataUtils = require('../DataUtils.js');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	DataUtils.getAllDate(function (err, data) {
		
		res.render('index', { title: 'Express', context:data, moment: moment});
	});
});

module.exports = router;
