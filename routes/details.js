var express = require( 'express' );
var router = express.Router();
var _ = require( 'lodash' );
var db = require( './../models' );

/* GET home page. */
router.get( '/', function(req, res){
	var response = res;
	var data = [];

	db.Perf.findAll( {attributes:['url'], group:'url'} ).success( function(res){
		_.forEach( res, function(val, index){
			data.push( val.dataValues );
		} )
		response.render( 'details', { title:'Page Performance System', data:data} );
	} ).error( function(err){
		response.render( 'error', {} );
	} );
} );

router.post( '/query', function(req, res){
	var body = req.body;
	if( body.url ){
		db.Perf.find( {where:{url:body.url}} ).success( function(dbRes){
			if( !dbRes ) return;
			var data = dbRes.dataValues;
			var elementCountDistExtra = [];
			var elementSizeDistExtra = [];
			_.forEach( data, function(value, key){
				//element count and size
				if( !/total_requests|big_requests|slow_requests/.test( key ) && /requests$/.test( key ) ){
					var flag = key.substr( 0, key.indexOf( '_' ) );
					elementCountDistExtra.push( {name:flag, value:value} );
					elementSizeDistExtra.push( {name:flag, value:data[flag + '_size']} );
				}
			} );

			if( !_.isEmpty( elementCountDistExtra ) )
				data['elementCountDistExtra'] = elementCountDistExtra;
			{
			}
			if( !_.isEmpty( elementSizeDistExtra ) ){
				data['elementSizeDistExtra'] = elementSizeDistExtra;
			}

			res.json( {code:0, data:data} );
		} ).error( function(err){
			res.json( {code:-1, data:null} );
		} );
	}
} );

module.exports = router;
