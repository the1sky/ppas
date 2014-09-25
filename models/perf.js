/**
 * Created by nant on 2014/8/22.
 */
module.exports = function(sequelize, DataTypes){
	var Perf = sequelize.define( 'Perf', {
		//metadata
		uid:{type:DataTypes.STRING, allowNull:true},
		day:{type:DataTypes.STRING, allowNull:true },
		url:{ type:DataTypes.STRING, allowNull:false},
		platform:{type:DataTypes.STRING, allowNull:true },
		browser:{type:DataTypes.STRING, allowNull:true },
		runstep:{type:DataTypes.INTEGER, allowNull:true },
		//metrics and offenders
		caching_not_specified:{type:DataTypes.INTEGER, allowNull:true },
		caching_not_specified_offender:{type:DataTypes.TEXT, allowNull:true },
		caching_too_short:{type:DataTypes.INTEGER, allowNull:true },
		caching_too_short_offender:{type:DataTypes.TEXT, allowNull:true },
		caching_disabled:{type:DataTypes.INTEGER, allowNull:true },
		caching_disabled_offender:{type:DataTypes.TEXT, allowNull:true },
		caching_old_headers:{type:DataTypes.INTEGER, allowNull:true },
		caching_old_headers_offender:{type:DataTypes.TEXT, allowNull:true },
		caching_not_specified:{type:DataTypes.TEXT, allowNull:true },
		cookies_count:{type:DataTypes.INTEGER, allowNull:true },
		cookies_count_offender:{type:DataTypes.TEXT, allowNull:true },
		cookies_sent_size:{type:DataTypes.INTEGER, allowNull:true },
		cookies_recv_size:{type:DataTypes.INTEGER, allowNull:true },
		cookies_domains:{type:DataTypes.INTEGER, allowNull:true },
		cookies_domains_offender:{type:DataTypes.TEXT, allowNull:true },
		cookies_document_size:{type:DataTypes.INTEGER, allowNull:true },
		cookies_document_count:{type:DataTypes.INTEGER, allowNull:true },
		headers_count:{type:DataTypes.INTEGER, allowNull:true },
		headers_sent_count:{type:DataTypes.INTEGER, allowNull:true },
		headers_recv_count:{type:DataTypes.INTEGER, allowNull:true },
		headers_size:{type:DataTypes.INTEGER, allowNull:true },
		headers_sent_size:{type:DataTypes.INTEGER, allowNull:true },
		headers_recv_size:{type:DataTypes.INTEGER, allowNull:true },
		headers_bigger_than_content:{type:DataTypes.INTEGER, allowNull:true },
		headers_bigger_than_content_offender:{type:DataTypes.TEXT, allowNull:true },
		domready_event:{type:DataTypes.INTEGER, allowNull:true },
		onload_event:{type:DataTypes.INTEGER, allowNull:true },
		global_variables:{type:DataTypes.INTEGER, allowNull:true },
		global_variables_offender:{type:DataTypes.TEXT, allowNull:true },
		global_variables_falsy:{type:DataTypes.INTEGER, allowNull:true },
		timing_appcache:{type:DataTypes.INTEGER, allowNull:true },
		timing_dns:{type:DataTypes.INTEGER, allowNull:true },
		timing_tcp:{type:DataTypes.INTEGER, allowNull:true },
		timing_ttfb:{type:DataTypes.INTEGER, allowNull:true },
		white_screen_time:{type:DataTypes.INTEGER, allowNull:true },
		first_screen_time:{type:DataTypes.INTEGER, allowNull:true },
		first_screen_time_offender:{type:DataTypes.TEXT, allowNull:true },
		document_height:{type:DataTypes.INTEGER, allowNull:true },
		load_time:{type:DataTypes.INTEGER, allowNull:true },
		domains:{type:DataTypes.INTEGER, allowNull:true },
		domains_offender:{type:DataTypes.TEXT, allowNull:true },
		max_requests_per_domain:{type:DataTypes.STRING, allowNull:true },
		max_requests_per_domain_offender:{type:DataTypes.TEXT, allowNull:true },
		total_requests:{type:DataTypes.INTEGER, allowNull:true },
		total_size:{type:DataTypes.STRING, allowNull:true },
		html_requests:{type:DataTypes.INTEGER, allowNull:true },
		html_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		html_size:{type:DataTypes.STRING, allowNull:true },
		jpeg_requests:{type:DataTypes.INTEGER, allowNull:true },
		jpeg_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		jpeg_size:{type:DataTypes.STRING, allowNull:true },
		flash_requests:{type:DataTypes.INTEGER, allowNull:true },
		flash_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		flash_size:{type:DataTypes.STRING, allowNull:true },
		gif_requests:{type:DataTypes.INTEGER, allowNull:true },
		gif_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		gif_size:{type:DataTypes.STRING, allowNull:true },
		js_requests:{type:DataTypes.INTEGER, allowNull:true },
		js_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		js_size:{type:DataTypes.STRING, allowNull:true },
		css_requests:{type:DataTypes.INTEGER, allowNull:true },
		css_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		css_size:{type:DataTypes.STRING, allowNull:true },
		image_requests:{type:DataTypes.INTEGER, allowNull:true },
		image_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		image_size:{type:DataTypes.STRING, allowNull:true },
		png_requests:{type:DataTypes.INTEGER, allowNull:true },
		png_requests_offender:{type:DataTypes.TEXT, allowNull:true },
		png_size:{type:DataTypes.STRING, allowNull:true },
		slow_requests:{type:DataTypes.INTEGER,allowNull:true},
		slow_requests_offender:{type:DataTypes.TEXT, allowNull:true},
		big_requests:{type:DataTypes.INTEGER,allowNull:true},
		big_requests_offender:{type:DataTypes.TEXT, allowNull:true},
		dom_count:{type:DataTypes.INTEGER, allowNull:true}
	},{
		timestamps: true,
		comment: "perf",
		engine: 'MYISAM'
	} );

	return Perf
}