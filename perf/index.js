/**
 *
 * Created by nant on 2014/8/24.
 */

var runningId = 0;
var ptModule = require( 'pagetimeline' );
var lodash = require( 'lodash' );
var db = require( './../models' );
var moment = require('moment');
var perf = {};

var pt = new ptModule( {url:'http://www.baidu.com', silent:true} );

pt.on( 'report', function(res){
	var result = JSON.parse( res );
	var toSave = {};

	toSave['url'] = result['url'];
	toSave['runstep'] = result['runstep'];
	toSave['uid'] = result['uid'];
	toSave['platform'] = 'win32';
	toSave['browser'] = 'chrome';
	toSave['day'] = moment(result['timestamp'] ).format('YYYYMMDD');

	var metrics = result['metrics'];
	var offenders = result['offenders'];
	lodash.forEach( metrics, function(metricValue, metricKey){
		if( metricKey == 'timing' ) return;

		toSave[metricKey] = metricValue;
		if( offenders[metricKey] ){
			toSave[metricKey + '_offender'] = JSON.stringify( offenders[metricKey] );
		}
	} );

	db.Perf.create( toSave ).complete( function(err, res){
		console.log( err, res );
	} );

	db.Urls.destroy({where:{id:runningId}} ).complete(function(err,res){
		if( !err ){
			console.log('remove in urls where id=:' + runningId );
		}else{
			console.log('error remove in urls where id=:' + runningId );
		}
	});
} );

pt.on( 'error', function(res){
	console.log( res );
} );

pt.on('end',function(res){
	console.log( res );
});

var CronJob = require( 'cron' ).CronJob;

var cronJob = new CronJob( '*/20 * * * * *', function(){
	/*
	db.Urls.find( { limit:1 } ).complete( function(err, res){
		if( !err && res && res.dataValues ){
			var dataValues = res.dataValues;
			var id = dataValues.id;
			var url = dataValues.url;
			runningId = id;
			pt.changeUrl( url );
			pt.start();
		}
	} );
	*/
}, null, true, "Asia/Shanghai" );

module.exports = lodash.extend( {
	schedule:cronJob,
	pagetimeline:pt
}, perf );

