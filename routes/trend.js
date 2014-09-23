var express = require( 'express' );
var router = express.Router();
var _ = require( 'lodash' );
var db = require( './../models' );
var metrics_trend = require('./../models/metrics_trend.js');

/* GET home page. */
router.get( '/', function(req, res){
	var response = res;
	var data = [];
	db.Perf.findAll( {attributes:['url'], group:'url'} ).success( function(res){
		_.forEach( res, function(val, index){
			data.push( val.dataValues );
		} );
		response.render( 'trend', { title:'Page Performance System', data:data, metrics:metrics_trend.metrics} );
	} ).error( function(err){
		response.render( 'error', {} );
	} );
} );

router.post( '/query', function(req, res){
	var body = req.body;
	if( body.url ){
		db.Perf.findAll( {where:{url:body.url, updatedAt:{between:[new Date( body.start ), new Date( body.end )]}}} ).success( function(dbRes){
			var data = [];
			_.forEach( dbRes, function(value, key){
				data.push( value.dataValues );
			} );
			;
			res.json( {code:0, data:data} )
		} ).error( function(err){
			res.json( {code:-1, data:null} );
		} );
	}
} );

module.exports = router;
