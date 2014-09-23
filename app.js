var express = require( 'express' );
var path = require( 'path' );
var favicon = require( 'static-favicon' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );

var routes = require( './routes/index' );
var users = require( './routes/users' );
var urls = require( './routes/urls' );
var details = require( './routes/details' );
var trend = require('./routes/trend');
var comp = require('./routes/comp');

var db = require( './models' );
var app = express();

// view engine setup;
app.set( 'title', 'page performance system' );
app.set( 'views', path.join( __dirname, 'views' ) )
app.set( 'view engine', 'jade' );

//timezone
app.set('tz', 'Asia/Shanghai');

app.use( favicon() );
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( '/', routes );
app.use( '/users', users );
app.use( '/urls', urls );
app.use( '/details', details );
app.use('/trend', trend );
app.use('/comp', comp );

/// catch 404 and forward to error handler
app.use( function(req, res, next){
	var err = new Error( 'Not Found' );
	err.status = 404;
	next( err );
} );

/// error handlers

// development error handler
// will print stacktrace
if( app.get( 'env' ) === 'development' ){
	app.use( function(err, req, res, next){
		res.status( err.status || 500 );
		res.render( 'error', {
			message:err.message,
			error:err
		} );
	} );
}

// production error handler
// no stacktraces leaked to user
app.use( function(err, req, res, next){
	res.status( err.status || 500 );
	res.render( 'error', {
		message:err.message,
		error:{}
	} );
} );

//start performance analysis system
var perf = require( './perf' );

module.exports = app;
