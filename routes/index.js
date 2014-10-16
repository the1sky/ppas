var express = require('express');
var router = express.Router();
var _ = require('lodash');
var db = require('./../models');

/* GET home page. */
router.get('/', function (req, res) {
	var response = res;
	var data = [];

	db.Perf
		.findAll({
			attributes: ['url', 'first_screen_time', 'white_screen_time', 'load_time', 'timing_ttfb', 'timing_dns'],
			groupBy: 'url',
			limit: 2000
		})
		.success(function (res) {
			_.forEach(res, function (val, index) {
				data.push(val.dataValues);
			});
			response.render('index', {
				title: 'Page Performance System',
				data: data
			});
		})
		.error(function (err) {
			response.render('error', {});
		});
});

module.exports = router;