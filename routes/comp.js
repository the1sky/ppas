var express = require( 'express' );
var router = express.Router();
var _ = require( 'lodash' );
var moment = require( 'moment' )
var db = require( './../models' );
var metrics_trend = require( './../models/metrics_trend.js' );

router.get( '/', function(req, res){
	var response = res;
	var data = [];

	db.Perf.findAll( {attributes:['url'], group:'url'} ).success( function(res){
		_.forEach( res, function(val, index){
			data.push( val.dataValues );
		} );
		response.render( 'comp', { title:'Page Performance Analysis System', data:data, metrics:metrics_trend.metrics} );
	} ).error( function(err){
		response.render( 'error', {} );
	} );
} );

router.post( '/query', function(req, res){
	var body = req.body;
	if( body.url ){
		var attributes = [];
		_.forEach( metrics_trend.metrics, function(item, index){
			attributes.push( item.name );
		} );
		attributes.push( 'url' );
		attributes.push( 'day' );

		var startDate = moment( body.start ).format( 'YYYYMMDD' );
		var endDate = moment( body.end ).format( 'YYYYMMDD' );
		db.Perf.findAll( {attributes:attributes, where:{url:[body.url, body.compurl], day:{between:[startDate, endDate]}}} ).success( function(dbRes){
			var data = [];
			_.forEach( dbRes, function(value, key){
				data.push( value.dataValues );
			} );
			res.json( {code:0, data:data} )
		} ).error( function(err){
			res.json( {code:-1, data:null} );
		} );
	}
} );

module.exports = router;
