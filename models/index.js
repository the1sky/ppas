/**
 * Created by nant on 2014/8/21.
 */
var fs = require( 'fs' );
var path = require( 'path' );
var Sequelize = require( 'sequelize' );
var lodash = require( 'lodash' );
var dbName = 'pagetimeline.db';
var db = {}

var sequelize = new Sequelize( 'ppas', 'root', '5460300', {
	dialect:'mysql',
	port:3306
} );

sequelize.authenticate().complete( function(err){
		if( !!err ){
			console.log( 'Unable to connect to the database:', err )
		}else{
			console.log( 'Connection has been established successfully.' )
		}
	} )

fs.readdirSync( __dirname ).filter( function(file){
	return (file.indexOf( '.' ) !== 0) && (file !== 'index.js') && ( file != dbName) && (file !== 'metrics_trend.js')
} ).forEach( function(file){
	var model = sequelize.import( path.join( __dirname, file ) )
	db[model.name] = model
} )

Object.keys( db ).forEach( function(modelName){
	if( 'associate' in db[modelName] ){
		db[modelName].associate( db )
	}
} )

sequelize.sync().complete( function(err){
	if( err ){
		throw err[0]
	}
} );

module.exports = lodash.extend( {
	sequelize:sequelize,
	Sequelize:Sequelize
}, db );