$( document ).ready( function(){
	$( '#menu_trend' ).css( 'background-color', '#f9f9f9' );

	var selectedUrl = '';
	var today = $.getDateStr( 0, '2014-08-23' );
	var startDate = today;
	var endDate = today;
	var startDate_suffix = ' 08:00:00';
	var endDate_suffix = ' 07:59:59';

	/**
	 * 设置checkbox
	 */
	$('.metriclist').iCheck({
		checkboxClass: 'icheckbox_flat-green',
		radioClass: 'iradio_flat-green',
		increaseArea: '20%' // optional
	});

	/**
	 * 时间选择
	 *
	 */
	var dateRange = new pickerDateRange( 'date_picker', {
		isTodayValid:true,
		startDate:startDate,
		endDate:endDate,
		autoSubmit:true,
		theme:'ta',
		defaultText:' 至 ',
		success:function(obj){
			startDate = obj['startDate'];
			endDate = obj['endDate'];
			$.getTrendData( selectedUrl, startDate + startDate_suffix, $.getDateStr( 1, endDate ) + endDate_suffix, function(json){
				preRender( json );
			} )
		}
	} );

	//render前数据处理
	var preRender = function(json){
		if( json && json.code == 0 ){
			$.perfData = json.data;
			renderDetails( json.data );
		}else{
		}
	}

	/**
	 * url选择器
	 *
	 * @type {*|jQuery|HTMLElement}
	 */
	var selector = $( '#urls' );
	selector.minimalect( {
		'afterinit':function(){
			var url = $.getUrlParam( 'url' );
			if( !url ){
				var firstUrl = $( '#urls option' )[0].value.toString();
				selectedUrl = firstUrl;
			}
			selector.val( selectedUrl ).change();
		},
		'onchange':function(val, txt){
			selectedUrl = val;
			$.getTrendData( val, startDate + startDate_suffix, $.getDateStr( 1, endDate ) + endDate_suffix, function(json){
				preRender( json );
			} );
		}
	} );


	var renderDetails = function(json){
		renderFirstScreenTime( json );
		renderWhiteScreenTime( json )
		renderOnLoadTime( json );
		renderTTFB( json );
		renderTotalSizeCount( json );
		renderHtmlSizeCount( json );
		renderJSSizeCount( json );
		renderCssSizeCount( json );
		renderImageSizeCount( json );
	};

	var renderFirstScreenTime = function(json){
		var len = json.length;
		var dateArr = [];
		var total = [];
		for( var i = 0; i < len; i++ ){
			dateArr.push( json[i].updatedAt );
			var firstScreenTime = json[i].first_screen_time;
			total.push( firstScreenTime );
		}
		var min = Math.min.apply( null, total );
		var max = Math.max.apply( null, total );

		var myChart = echarts.init( document.getElementById( 'first_screen_time_trend' ) );
		var option = {
			title:{
				text:'首屏时间趋势:'
			},
			legend:{                                   // 图例配置
				padding:5,                             // 图例内边距，单位px，默认上下左右内边距为5
				itemGap:1,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
				data:['首屏时间']
			},
			tooltip:{                                  // 气泡提示配置
				trigger:'item'                        // 触发类型，默认数据触发，可选为：'axis'
			},
			xAxis:[                                    // 直角坐标系中横轴数组
				{
					type:'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
					data:dateArr
				}
			],
			yAxis:[                                    // 直角坐标系中纵轴数组
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'时间',
					min:min,
					max:max,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				}
			],
			series:[
				{
					name:'首屏时间',
					type:'line',
					data:total
				},
			]
		};
		myChart.setOption( option );
	}

	var renderWhiteScreenTime = function(json){
		var len = json.length;
		var dateArr = [];
		var total = [];
		for( var i = 0; i < len; i++ ){
			dateArr.push( json[i].updatedAt );
			var whiteScreenTime = json[i].white_screen_time;
			total.push( whiteScreenTime );
		}
		var min = Math.min.apply( null, total );
		var max = Math.max.apply( null, total );

		var myChart = echarts.init( document.getElementById( 'white_screen_time_trend' ) );
		var option = {
			title:{
				text:'白屏时间趋势:'
			},
			legend:{                                   // 图例配置
				padding:5,                             // 图例内边距，单位px，默认上下左右内边距为5
				itemGap:10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
				data:['白屏时间']
			},
			tooltip:{                                  // 气泡提示配置
				trigger:'item'                        // 触发类型，默认数据触发，可选为：'axis'
			},
			xAxis:[                                    // 直角坐标系中横轴数组
				{
					type:'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
					data:dateArr
				}
			],
			yAxis:[                                    // 直角坐标系中纵轴数组
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'时间',
					min:min,
					max:max,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				}
			],
			series:[
				{
					name:'白屏时间',
					type:'line',
					data:total
				},
			]
		};
		myChart.setOption( option );
	}

	var renderOnLoadTime = function(json){
		var len = json.length;
		var dateArr = [];
		var total = [];
		for( var i = 0; i < len; i++ ){
			dateArr.push( json[i].updatedAt );
			var onloadTime = json[i].onloadEvent;
			total.push( onloadTime );
		}
		var min = Math.min.apply( null, total );
		var max = Math.max.apply( null, total );

		var myChart = echarts.init( document.getElementById( 'onload_time_trend' ) );
		var option = {
			title:{
				text:'onload时间趋势:'
			},
			legend:{                                   // 图例配置
				padding:5,                             // 图例内边距，单位px，默认上下左右内边距为5
				itemGap:10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
				data:['onload时间']
			},
			tooltip:{                                  // 气泡提示配置
				trigger:'item'                        // 触发类型，默认数据触发，可选为：'axis'
			},
			xAxis:[                                    // 直角坐标系中横轴数组
				{
					type:'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
					data:dateArr
				}
			],
			yAxis:[                                    // 直角坐标系中纵轴数组
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'时间',
					min:min,
					max:max,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				}
			],
			series:[
				{
					name:'onload时间',
					type:'line',
					data:total
				},
			]
		};
		myChart.setOption( option );
	}

	var renderTTFB = function(json){
		var len = json.length;
		var dateArr = [];
		var total = [];
		for( var i = 0; i < len; i++ ){
			dateArr.push( json[i].updatedAt );
			var time = json[i].timing_ttfb;
			total.push( time );
		}
		var min = Math.min.apply( null, total );
		var max = Math.max.apply( null, total );

		var myChart = echarts.init( document.getElementById( 'ttfb_trend' ) );
		var option = {
			title:{
				text:'首字节时间趋势:'
			},
			legend:{                                   // 图例配置
				padding:5,                             // 图例内边距，单位px，默认上下左右内边距为5
				itemGap:10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
				data:['首字节时间']
			},
			tooltip:{                                  // 气泡提示配置
				trigger:'item'                        // 触发类型，默认数据触发，可选为：'axis'
			},
			xAxis:[                                    // 直角坐标系中横轴数组
				{
					type:'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
					data:dateArr
				}
			],
			yAxis:[                                    // 直角坐标系中纵轴数组
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'时间',
					min:min,
					max:max,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				}
			],
			series:[
				{
					name:'首字节时间',
					type:'line',
					data:total
				},
			]
		};
		myChart.setOption( option );
	}

	var renderTotalSizeCount = function(json){
		var len = json.length;
		var dateArr = [];
		var totalSizeArr = [];
		var totalCountArr = [];
		for( var i = 0; i < len; i++ ){
			dateArr.push( json[i].updatedAt );
			var totalSize = json[i].total_size;
			totalSize = totalSize.substr( 0, totalSize.length - 2 );
			totalSizeArr.push( totalSize );
			totalCountArr.push( json[i].total_requests );
		}
		var sizeMin = Math.min.apply( null, totalSizeArr );
		var sizeMax = Math.max.apply( null, totalSizeArr );
		var countMin = Math.min.apply( null, totalCountArr );
		var countMax = Math.max.apply( null, totalCountArr );

		var myChart = echarts.init( document.getElementById( 'totalSizeCount' ) );
		var option = {
			title:{
				text:'总传输大小与请求数:'
			},
			legend:{                                   // 图例配置
				padding:5,                             // 图例内边距，单位px，默认上下左右内边距为5
				itemGap:10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
				data:['传输大小', '请求数']
			},
			tooltip:{                                  // 气泡提示配置
				trigger:'item'                        // 触发类型，默认数据触发，可选为：'axis'
			},
			xAxis:[                                    // 直角坐标系中横轴数组
				{
					type:'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
					data:dateArr
				}
			],
			yAxis:[                                    // 直角坐标系中纵轴数组
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'传输大小',
					boundaryGap:[0.1, 0.1],            // 坐标轴两端空白策略，数组内数值代表百分比
					min:sizeMin,
					max:sizeMax,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				},
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'请求数',
					min:countMin,
					max:countMax,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				}
			],
			series:[
				{
					name:'传输大小',                        // 系列名称
					type:'line',                       // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
					data:totalSizeArr
				},
				{
					name:'请求数',
					type:'line',
					yAxisIndex:1,
					data:totalCountArr
				},
			]
		};
		myChart.setOption( option );
	}

	var renderHtmlSizeCount = function(json){
		var len = json.length;
		var dateArr = [];
		var totalSizeArr = [];
		var totalCountArr = [];
		for( var i = 0; i < len; i++ ){
			dateArr.push( json[i].updatedAt );
			var totalSize = json[i].html_size;
			totalSize = totalSize.substr( 0, totalSize.length - 2 );
			totalSizeArr.push( totalSize );
			totalCountArr.push( json[i].html_requests );
		}
		var sizeMin = Math.min.apply( null, totalSizeArr );
		var sizeMax = Math.max.apply( null, totalSizeArr );
		var countMin = Math.min.apply( null, totalCountArr );
		var countMax = Math.max.apply( null, totalCountArr );

		var myChart = echarts.init( document.getElementById( 'htmlSizeCount' ) );
		var option = {
			title:{
				text:'HTML传输大小与请求数:'
			},
			legend:{                                   // 图例配置
				padding:5,                             // 图例内边距，单位px，默认上下左右内边距为5
				itemGap:10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
				data:['传输大小', '请求数']
			},
			tooltip:{                                  // 气泡提示配置
				trigger:'item'                        // 触发类型，默认数据触发，可选为：'axis'
			},
			xAxis:[                                    // 直角坐标系中横轴数组
				{
					type:'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
					data:dateArr
				}
			],
			yAxis:[                                    // 直角坐标系中纵轴数组
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'传输大小',
					min:sizeMin,
					max:sizeMax,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				},
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'请求数',
					min:countMin,
					max:countMax,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				}
			],
			series:[
				{
					name:'传输大小',                        // 系列名称
					type:'line',                       // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图rada
					yAxisIndex:0,
					data:totalSizeArr
				},
				{
					name:'请求数',
					type:'line',
					yAxisIndex:1,
					data:totalCountArr
				},
			]
		};
		myChart.setOption( option );
	}

	var renderJSSizeCount = function(json){
		var len = json.length;
		var dateArr = [];
		var totalSizeArr = [];
		var totalCountArr = [];
		for( var i = 0; i < len; i++ ){
			dateArr.push( json[i].updatedAt );
			var totalSize = json[i].js_size;
			totalSize = totalSize.substr( 0, totalSize.length - 2 );
			totalSizeArr.push( totalSize );
			totalCountArr.push( json[i].js_requests );
		}
		var sizeMin = Math.min.apply( null, totalSizeArr );
		var sizeMax = Math.max.apply( null, totalSizeArr );
		var countMin = Math.min.apply( null, totalCountArr );
		var countMax = Math.max.apply( null, totalCountArr );

		var myChart = echarts.init( document.getElementById( 'jsSizeCount' ) );
		var option = {
			title:{
				text:'JS传输大小与请求数:'
			},
			legend:{                                   // 图例配置
				padding:5,                             // 图例内边距，单位px，默认上下左右内边距为5
				itemGap:10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
				data:['传输大小', '请求数']
			},
			tooltip:{                                  // 气泡提示配置
				trigger:'item'                        // 触发类型，默认数据触发，可选为：'axis'
			},
			xAxis:[                                    // 直角坐标系中横轴数组
				{
					type:'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
					data:dateArr
				}
			],
			yAxis:[                                    // 直角坐标系中纵轴数组
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'传输大小',
					min:200,
					max:300,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				},
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'请求数',
					min:sizeMin,
					max:sizeMax,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				}
			],
			series:[
				{
					name:'传输大小',                        // 系列名称
					type:'line',                       // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图rada
					yAxisIndex:0,
					data:totalSizeArr
				},
				{
					name:'请求数',
					type:'line',
					yAxisIndex:1,
					data:totalCountArr
				},
			]
		};
		myChart.setOption( option );
	}

	var renderCssSizeCount = function(json){
		var len = json.length;
		var dateArr = [];
		var totalSizeArr = [];
		var totalCountArr = [];
		for( var i = 0; i < len; i++ ){
			dateArr.push( json[i].updatedAt );
			var totalSize = json[i].css_size;
			if( totalSize ){
				totalSize = totalSize.substr( 0, totalSize.length - 2 );
			}
			totalSizeArr.push( totalSize );
			totalCountArr.push( json[i].css_requests );
		}
		var sizeMin = Math.min.apply( null, totalSizeArr );
		var sizeMax = Math.max.apply( null, totalSizeArr );
		var countMin = Math.min.apply( null, totalCountArr );
		var countMax = Math.max.apply( null, totalCountArr );

		var myChart = echarts.init( document.getElementById( 'cssSizeCount' ) );
		var option = {
			title:{
				text:'CSS传输大小与请求数:'
			},
			legend:{                                   // 图例配置
				padding:5,                             // 图例内边距，单位px，默认上下左右内边距为5
				itemGap:10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
				data:['传输大小', '请求数']
			},
			tooltip:{                                  // 气泡提示配置
				trigger:'item'                        // 触发类型，默认数据触发，可选为：'axis'
			},
			xAxis:[                                    // 直角坐标系中横轴数组
				{
					type:'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
					data:dateArr
				}
			],
			yAxis:[                                    // 直角坐标系中纵轴数组
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'传输大小',
					min:sizeMin,
					max:sizeMax,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				},
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'请求数',
					min:countMin,
					max:countMin,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				}
			],
			series:[
				{
					name:'传输大小',                        // 系列名称
					type:'line',                       // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图rada
					yAxisIndex:0,
					data:totalSizeArr
				},
				{
					name:'请求数',
					type:'line',
					yAxisIndex:1,
					data:totalCountArr
				},
			]
		};
		myChart.setOption( option );
	}

	var renderImageSizeCount = function(json){
		var len = json.length;
		var dateArr = [];
		var totalSizeArr = [];
		var totalCountArr = [];
		for( var i = 0; i < len; i++ ){
			dateArr.push( json[i].updatedAt );
			var totalSize = json[i].image_size;
			totalSize = totalSize.substr( 0, totalSize.length - 2 );
			totalSizeArr.push( totalSize );
			totalCountArr.push( json[i].image_requests );
		}
		var sizeMin = Math.min.apply( null, totalSizeArr );
		var sizeMax = Math.max.apply( null, totalSizeArr );
		var countMin = Math.min.apply( null, totalCountArr );
		var countMax = Math.max.apply( null, totalCountArr );

		var myChart = echarts.init( document.getElementById( 'imageSizeCount' ) );
		var option = {
			title:{
				text:'Image传输大小与请求数:'
			},
			legend:{                                   // 图例配置
				padding:5,                             // 图例内边距，单位px，默认上下左右内边距为5
				itemGap:10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
				data:['传输大小', '请求数']
			},
			tooltip:{                                  // 气泡提示配置
				trigger:'item'                        // 触发类型，默认数据触发，可选为：'axis'
			},
			xAxis:[                                    // 直角坐标系中横轴数组
				{
					type:'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
					data:dateArr
				}
			],
			yAxis:[                                    // 直角坐标系中纵轴数组
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'传输大小',
					min:sizeMax,
					max:sizeMax,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				},
				{
					type:'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name:'请求数',
					min:countMin,
					max:countMax,
					splitNumber:4                      // 数值轴用，分割段数，默认为5
				}
			],
			series:[
				{
					name:'传输大小',                        // 系列名称
					type:'line',                       // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图rada
					yAxisIndex:0,
					data:totalSizeArr
				},
				{
					name:'请求数',
					type:'line',
					yAxisIndex:1,
					data:totalCountArr
				},
			]
		};
		myChart.setOption( option );
	}

	var renderFlashSizeCount = function(json){
	}

	var renderDomCount = function(json){

	}

	var renderCacheResource = function(json){
	}

	var renderDomainAndMax = function(json){
	}
} );

