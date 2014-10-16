/**
 * Created by nant on 2014/8/22.
 */
module.exports = function(sequelize, DataTypes){
	var Offenders = sequelize.define( 'Offenders', {
		url:{ type:DataTypes.STRING(255), allowNull:false, unique:true},
		uid:{type:DataTypes.STRING, allowNull:true},
		runstep:{type:DataTypes.INTEGER, allowNull:true },
		caching_too_short_offender:{type:DataTypes.TEXT, allowNull:true },
		caching_disabled_offender:{type:DataTypes.TEXT, allowNull:true },
		caching_old_headers_offender:{type:DataTypes.TEXT, allowNull:true },
		cookies_count_offender:{type:DataTypes.TEXT, allowNull:true },
		cookies_domains_offender:{type:DataTypes.TEXT, allowNull:true },
		headers_bigger_than_content_offender:{type:DataTypes.TEXT, allowNull:true },
		global_variables_offender:{type:DataTypes.TEXT, allowNull:true },
		first_screen_time_offender:{type:DataTypes.TEXT, allowNull:true },
		domains_offender:{type:DataTypes.TEXT, allowNull:true },
		max_requests_per_domain_offender:{type:DataTypes.TEXT, allowNull:true },
		html_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		jpeg_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		flash_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		gif_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		js_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		css_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		image_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		png_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		slow_requests_offender:{type:DataTypes.TEXT, allowNull:true},
		big_requests_offender:{type:DataTypes.TEXT, allowNull:true}
	},{
		timestamps: true,
		comment: "urls",
		engine: 'MYISAM'
	} );
	return Offenders;
}