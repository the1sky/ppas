$( document ).ready( function(){
	$( '#menu_details' ).css( 'background-color', '#f9f9f9' );

	var getUrlData = function(url){
		console.log( url );
		$.ajax( {
			'url':'/details/query',
			'type':'post',
			'data':{url:url},
			'complete':function(res){
				var resJson = res.responseJSON
				if( resJson.code == 0 ){
					$.perfData = resJson.data;
					console.log( $.perfData );
					renderDetails( resJson.data );
				}else{
				}
			}
		} );
	}

	var selector = $( '#urls' );
	selector.minimalect( {
		'afterinit':function(){
			var url = $.getUrlParam( 'url' );
			if( !url ){
				var firstUrl = $( '#urls option' )[0].value.toString();
				url = firstUrl;
				getUrlData( url );
			}
			selector.val( url ).change();
		},
		'onchange':function(val, txt){
			getUrlData( val );
		}
	} );

	var renderDetails = function(json){
		renderSummary( json );
		renderElementCount( json );
		renderElementSize( json );
		renderSlowTop( json );
		renderCookiesCount( json );
		$( '#dist_table a:first' ).tab( 'show' );
		$( '#dist_table_detail a:first' ).tab( 'show' );
		$( '#cookies_detail_tab a:first' ).tab( 'show' );
		$( '#domain_detail_tab a:first' ).tab( 'show' );
		$( '#head_detail_tab a:first' ).tab( 'show' );
	};

	/**
	 * 性能概况
	 *
	 * @param json
	 */
	var renderSummary = function(json){
		$( '#request_count_content strong' ).html( json['total_requests'] );
		$( '#first_screen_time_content strong' ).html( json['first_screen_time'] );
		$( '#white_screen_time_content strong' ).html( json['white_screen_time'] );
		$( '#domready_content strong' ).html( json['domreadyEvent'] );
		$( '#onload_content strong' ).html( json['onloadEvent'] );
		$( '#ttfb_content strong' ).html( json['timing_ttfb'] );
		$( '#dom_count_content strong' ).html( json['dom_count'] );
		$( '#paint_time_content strong' ).html( json['paint_time'] );
		$( '#js_time_content strong' ).html( json['js_time'] );
		$( '#request_time_content strong' ).html( json['request_time'] );
	}

	/**
	 * 资源分类个数占比
	 *
	 * @param json
	 */
	var renderElementCount = function(json){
		var elementCountDist = json['elementCountDistExtra'];
		var elementsNames = [];
		for( var i = 0; i < elementCountDist.length; i++ ){
			elementsNames.push( elementCountDist[i].name );
		}
		if( !$.elemCountChart ){
			$.elemCountChart = echarts.init( document.getElementById( 'element_count' ) );
		}
		var option = {
			tooltip:{
				trigger:'item',
				formatter:"{a} <br/>{b} : {c} ({d}%)"
			},
			toolbox:{
				show:false,
				feature:{
					mark:{show:true},
					dataView:{show:true, readOnly:false},
					restore:{show:true},
					saveAsImage:{show:true}
				}
			},
			calculable:true,
			series:[
				{
					type:'pie',
					radius:'55%',
					center:['50%', '60%'],
					data:elementCountDist
				}
			]
		};
		$.elemCountChart.setOption( option );
	}

	/**
	 * 资源分类大小占比
	 *
	 * @param json
	 */
	var renderElementSize = function(json){
		var elementSizeDist = json['elementSizeDistExtra'];
		var elementsNames = [];
		var elementsValues = [];
		for( var i = 0; i < elementSizeDist.length; i++ ){
			var value = elementSizeDist[i].value;
			var name = elementSizeDist[i].name;
			if( value ){
				value = value.substr( 0, value.length - 2 );
			}else{
				value = 0;
			}
			elementsValues.push( {
				name:name,
				value:value
			} );
			elementsNames.push( name );
		}
		if( !$.elemSizeChart ){
			$.elemSizeChart = echarts.init( document.getElementById( 'element_size' ) );
		}
		var option = {
			tooltip:{
				trigger:'item',
				formatter:"{a} <br/>{b} : {c} ({d}%)"
			},
			toolbox:{
				show:false,
				feature:{
					mark:{show:true},
					dataView:{show:true, readOnly:false},
					restore:{show:true},
					saveAsImage:{show:true}
				}
			},
			calculable:true,
			series:[
				{
					type:'pie',
					radius:'55%',
					center:['50%', '60%'],
					data:elementsValues
				}
			]
		};
		$.elemSizeChart.setOption( option );
	}

	/**
	 * 资源缓存时间
	 *
	 * @param json
	 */
	var renderCacheTime = function(json){
		$( '#cache_time' ).empty();
		var chart = dc.barChart( "#cache_time" );
		var data = [
			{ 'Expt':1, 'Run':1, 'Speed':85, 'title':'Title1'  },
			{ 'Expt':2, 'Run':2, 'Speed':34, 'title':'Title2'  },
			{ 'Expt':1, 'Run':3, 'Speed':90, 'title':'Title3' },
			{ 'Expt':1, 'Run':4, 'Speed':107, 'title':'Title4' },
			{ 'Expt':1, 'Run':5, 'Speed':40, 'title':'Title4' }
		];
		var ndx = crossfilter( data ), runDimension = ndx.dimension( function(d){
			return +d.Run;
		} );
		var speedSumGroup = runDimension.group().reduceSum( function(d){
			return d.Speed;
		} );

		chart.width( 768 ).height( 350 ).dimension( runDimension ).group( speedSumGroup ).transitionDuration( 1500 ).centerBar( true ).gap( 60 ).x( d3.scale.linear().domain( [0, 5.5] ) ).y( d3.scale.linear().domain( [0, 300] ) ).elasticY( true ).on( "filtered", function(chart){
			dc.events.trigger( function(){
			} );
		} ).xAxis().tickFormat( function(v){
			return v;
		} );

		chart.render();
		labels = chart.g().selectAll( "rect.bar text" );
	}

	/**
	 * 最慢资源top 5
	 *
	 * @param json
	 */
	var renderSlowTop = function(json){
		$( '#element_slow' ).empty();
		var slow_requests = json['slow_requests_offender'];
		var slow_requests = eval( '(' + slow_requests + ')' );
		var len = slow_requests.length;
		var renderData = {
			'items':[]
		};
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[],
				'url':''
			};
			var urlInfo = slow_requests[i];
			urlInfo = urlInfo.split( ' ' );
			var url = urlInfo[0];
			var time = urlInfo[urlInfo.length - 1];

			item.badges.push( {badge:time} );
			item.url = url;
			renderData.items.push( item );
		}
		var template = $( '#top_urls_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#element_slow' ).html( rendered );
	}
	/**
	 * 最大元素top 5
	 *
	 * @param json
	 */
	var renderBigTop = function(json){
		$( '#element_big' ).empty();
		var big_requests = json['big_requests_offender'];
		var big_requests = eval( '(' + big_requests + ')' );
		var len = big_requests.length;
		var renderData = {
			'items':[]
		};
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[],
				'url':''
			};
			var urlInfo = big_requests[i];
			urlInfo = urlInfo.split( ' ' );
			var url = urlInfo[0];
			var size = urlInfo[urlInfo.length - 1];

			item.badges.push( {badge:size} );
			item.url = url;
			renderData.items.push( item );
		}
		var template = $( '#top_urls_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#element_big' ).html( rendered );
	}

	/**
	 * cookies count
	 *
	 * @param json
	 */
	var renderCookiesCount = function(json){
		$( '#cookies_count_detail' ).empty();
		var cookies_count = json['cookies_count'];
		var cookies_count_offender = json['cookies_count_offender'];
		cookies_count_offender = eval( '(' + cookies_count_offender + ')' );

		//process cookies_count
		var len = cookies_count_offender.length;
		var renderData = {
			'items':[]
		};
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[
					{
						badge:i + 1
					}
				],
				'content':''
			};
			var info = cookies_count_offender[i];
			item.content = info;
			renderData.items.push( item );
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#cookies_count_detail' ).html( rendered );
	}

	/**
	 * cookies domain
	 *
	 * @param json
	 */
	var renderCookiesDomains = function(json){
		$( '#cookies_domains_detail' ).empty();
		var cookies_domains = json['cookies_domains'];
		var cookies_domains_offender = json['cookies_domains_offender'];
		cookies_domains_offender = eval( '(' + cookies_domains_offender + ')' );

		var len = cookies_domains_offender.length;
		var renderData = {
			'items':[]
		};
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[
					{
						badge:i + 1
					}
				],
				'content':''
			};
			var info = cookies_domains_offender[i];
			info = info.split( ':' );
			item.content = info[0];
			item.badges.push( {badge:info[1]} );
			renderData.items.push( item );
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#cookies_domains_detail' ).html( rendered );
	}

	var renderDomCount = function(json){
		$( '#dom_count_detail' ).empty();
		var renderData = {
			'items':{
				'badges':[
				],
				'content':json['dom_count']
			}
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		console.log( rendered );
		$( '#dom_count_detail' ).html( rendered );
	}

	var renderDomMaxDepth = function(json){
		$( '#dom_max_depth_detail' ).empty();
		var renderData = {
			'items':{
				'badges':[
				],
				'content':json['dom_max_depth']
			}
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		console.log( rendered );
		$( '#dom_max_depth_detail' ).html( rendered );
	}

	var renderWhiteSpace = function(json){
		$( '#dom_white_space_detail' ).empty();
		var renderData = {
			'items':{
				'badges':[
				],
				'content':json['dom_white_space_size']
			}
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		console.log( rendered );
		$( '#dom_white_space_detail' ).html( rendered );
	}
	var renderDomHidden = function(json){
		$( '#dom_hidden_detail' ).empty();
		var domHiddenOffender = json['dom_hidden_size_offender'];
		domHiddenOffender = eval( '(' + domHiddenOffender + ')' );
		var len = domHiddenOffender.length;
		var renderData = {
			'items':[]
		};
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[
					{
						badge:i + 1
					}
				],
				'content':''
			};
			var info = domHiddenOffender[i];
			info = info.split( '(' );
			item.content = info[0];
			item.badges.push( {badge:info[1]} );
			renderData.items.push( item );
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#dom_hidden_detail' ).html( rendered );
	}

	var renderComment = function(json){
		$( '#dom_comment_detail' ).empty();
		var domCommentOffender = json['dom_comment_size_offender'];
		domCommentOffender = eval( '(' + domCommentOffender + ')' );
		var len = domCommentOffender.length;
		var renderData = {
			'items':[]
		};
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[
					{
						badge:i + 1
					}
				],
				'content':''
			};
			var info = domCommentOffender[i];
			info = info.split( '(' );
			item.content = info[0];
			item.badges.push( {badge:info[1]} );
			renderData.items.push( item );
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#dom_comment_detail' ).html( rendered );
	}

	var renderInlineCss = function(json){
		$( '#dom_inline_css_detail' ).empty();
		var domInlineCssOffender = json['dom_inline_css_count_offender'];
		domInlineCssOffender = eval( '(' + domInlineCssOffender + ')' );
		var len = domInlineCssOffender.length;
		var renderData = {
			'items':[]
		};
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[
					{
						badge:i + 1
					}
				],
				'content':domInlineCssOffender[i]
			};
			renderData.items.push( item );
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#dom_inline_css_detail' ).html( rendered );
	}

	/**
	 * timing
	 *
	 * @param json
	 */
	var renderTiming = function(json){
		$( '#timing_detail' ).empty();

		var timing_data = [];
		for( var metric in json ){
			if( /^timing_/.test( metric ) ){
				timing_data.push( {name:metric, value:json[metric]} );
			}
		}
		var len = timing_data.length;
		var renderData = {
			'items':[]
		};
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[
					{
						'badge':timing_data[i]['value'] + ' ms'
					}
				],
				'content':timing_data[i]['name']
			};

			renderData.items.push( item );
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#timing_detail' ).html( rendered );
	}

	/**
	 * domains
	 *
	 * @param json
	 */
	var renderDomainsCount = function(json){
		$( '#domain_count_detail' ).empty();

		var domain_count_offender = json['domains_offender'];
		domain_count_offender = eval( '(' + domain_count_offender + ')' );

		var len = domain_count_offender.length;
		var renderData = {
			'items':[]
		};
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[
					{
						'badge':i + 1
					}
				],
				'content':domain_count_offender[i]
			};

			renderData.items.push( item );
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#domain_count_detail' ).html( rendered );
	}

	/**
	 *  domain max
	 *
	 * @param json
	 */
	var renderDomainsMax = function(json){
		$( '#domain_max_detail' ).empty();

		var max_request_domain = json['max_requests_per_domain'];
		var domain_request_max = json['max_requests_per_domain_offender'];
		domain_request_max = eval( '(' + domain_request_max + ')' );

		var renderData = {
			'items':[]
		};
		var item = {
			'badges':[
				{
					'badge':domain_request_max[0] + ' 个'
				}
			],
			'content':max_request_domain
		};

		renderData.items.push( item );
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#domain_max_detail' ).html( rendered );
	}

	/**
	 *  全局变量
	 *
	 * @param json
	 */
	var renderGlobalVar = function(json){
		$( '#global_var' ).empty();

		var global_var_count = json['global_variables'];
		var global_var_offender = json['global_variables_offender'];
		global_var_offender = eval( '(' + global_var_offender + ')' );

		var renderData = {
			'items':[]
		};

		var len = global_var_offender.length;
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[
					{
						'badge':i + 1
					}
				],
				'content':global_var_offender[i]
			};
			renderData.items.push( item );
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#global_var' ).html( rendered );
	}

	/**
	 *  头文件概述信息
	 *
	 * @param json
	 */
	var renderHeadCommon = function(json){
		$( '#head_common_detail' ).empty();

		var head_data = [];
		for( var metric in json ){
			if( /^headers_/.test( metric ) && !/headers_bigger_than_content/.test( metric ) ){
				head_data.push( {
					'name':metric,
					'value':json[metric]
				} );
			}
		}
		var renderData = {
			'items':[]
		};
		var len = head_data.length;
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[
					{
						'badge':head_data[i].value
					}
				],
				'content':head_data[i].name
			};
			renderData.items.push( item );
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#head_common_detail' ).html( rendered );
	}

	/**
	 * 头文件大于body
	 *
	 * @param json
	 */
	var renderHeadBig = function(json){
		$( '#head_big_detail' ).empty();

		var head_big_than_content = json['headers_bigger_than_content_offender'];
		head_big_than_content = eval( '(' + head_big_than_content + ')' );

		var renderData = {
			'items':[]
		};
		var len = head_big_than_content.length;
		for( var i = 0; i < len; i++ ){
			var item = {
				'badges':[
					{
						'badge':i + 1
					}
				],
				'content':head_big_than_content[i]
			};
			renderData.items.push( item );
		}
		var template = $( '#cookies_t' ).html();
		Mustache.parse( template );   // optional, speeds up future uses
		var rendered = Mustache.render( template, renderData );
		$( '#head_big_detail' ).html( rendered );
	}

	$( '#dist_table a' ).click( function(e){
		e.preventDefault()
		$( this ).tab( 'show' )
	} );
	$( '#dist_table_detail a' ).click( function(e){
		e.preventDefault()
		$( this ).tab( 'show' )
	} );

	$( '#dom_detail_tab a' ).click( function(e){
		console.log( 10 );
		e.preventDefault();
		$( this ).tab( 'show' );
	} );

	$( '#cookies_detail_tab a' ).click( function(e){
		e.preventDefault();
		$( this ).tab( 'show' );
	} );

	$( '#domain_detail_tab a' ).click( function(e){
		e.preventDefault();
		$( this ).tab( 'show' );
	} );

	$( '#head_detail_tab a' ).click( function(e){
		e.preventDefault();
		$( this ).tab( 'show' );
	} );


	$( 'a[data-toggle="tab"]' ).on( 'show.bs.tab', function(e){
		var href = e.target.href;
		if( /element_count/.test( href ) ){
			renderElementCount( $.perfData );
		}else if( /element_size/.test( href ) ){
			renderElementSize( $.perfData );
		}else if( /cache_time/.test( href ) ){
			renderCacheTime();
		}else if( /element_slow/.test( href ) ){
			renderSlowTop( $.perfData );
		}else if( /element_big/.test( href ) ){
			renderBigTop( $.perfData );
		}else if( /cookies_detail/.test( href ) ){
			renderCookiesCount( $.perfData );
		}else if( /cookies_count_detail/.test( href ) ){
			renderCookiesCount( $.perfData );
		}else if( /cookies_domains_detail/.test( href ) ){
			renderCookiesDomains( $.perfData );
		}else if( /timing_detail/.test( href ) ){
			renderTiming( $.perfData );
		}else if( /domain_detail/.test( href ) ){
			renderDomainsCount( $.perfData );
		}else if( /domain_count_detail/.test( href ) ){
			renderDomainsCount( $.perfData );
		}else if( /domain_max_detail/.test( href ) ){
			renderDomainsMax( $.perfData );
		}else if( /global_var/.test( href ) ){
			renderGlobalVar( $.perfData );
		}else if( /head_detail/.test( href ) ){
			renderHeadCommon( $.perfData );
		}else if( /head_common_detail/.test( href ) ){
			renderHeadCommon( $.perfData );
		}else if( /head_big_detail/.test( href ) ){
			renderHeadBig( $.perfData );
		}else if( /dom_detail/.test( href ) ){
			renderDomCount( $.perfData )
		}else if( /dom_count_detail/.test(href)){
			renderDomCount( $.perfData );
		}else if( /dom_max_depth_detail/.test(href)){
			renderDomMaxDepth( $.perfData );
		}else if( /dom_hidden_detail/.test(href)){
			renderDomHidden( $.perfData );
		}else if( /dom_comment_detail/.test(href)){
			renderComment( $.perfData );
		}else if(/dom_inline_css_detail/.test(href)){
			renderInlineCss( $.perfData );
		}else if(/dom_white_space_detail/.test(href)){
		renderWhiteSpace( $.perfData );
	}
	} );
} );

//har viewer, called by har viewer
function setHarviewerHeight(height){
	$( '#harviewer' ).height( height );
}

