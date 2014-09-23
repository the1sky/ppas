/**
 * Created by nant on 2014/8/22.
 */
module.exports = function(sequelize, DataTypes){
	var Urls = sequelize.define( 'Urls', {
		url:{ type:DataTypes.STRING(255), allowNull:false, unique:true},
		compurl:{ type:DataTypes.STRING(255), allowNull:false}
	},{
		timestamps: true,
		comment: "urls"
	} );
	return Urls;
}