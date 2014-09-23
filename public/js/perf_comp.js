$( document ).ready( function(){
	$( '#menu_comp' ).css( 'background-color', '#f9f9f9' );

	var selectedUrl = '';
	var compUrl = '';
	var today = $.getDateStr( 0 );
	//var startDate = today;
	//var endDate = today;
	var startDate = $.getDateStr(0, '2014-08-20');
	var endDate = $.getDateStr( 0, '2014-08-31' );

	var chart_list = {};

	var echartsOption = function(title, legendData, xAxisData, selectedUrlData, compUrlData){
		var selectedUrl = legendData[0];
		var compUrl = legendData[1];
		return {
			title:{
				text:title
			},
			tooltip:{
				trigger:'axis'
			},
			legend:{
				data:legendData
			},
			calculable:true,
			xAxis:[
				{
					type:'category',
					data:xAxisData
				}
			],
			yAxis:[
				{
					type:'value'
				}
			],
			series:[
				{
					name:selectedUrl,
					type:'bar',
					data:selectedUrlData,
					markPoint:{
						data:[
							{type:'max', name:'最大值'},
							{type:'min', name:'最小值'}
						]
					},
					markLine:{
						data:[
							{type:'average', name:'平均值'}
						]
					}
				},
				{
					name:compUrl,
					type:'bar',
					data:compUrlData,
					markPoint:{
						data:[
							{type:'max', name:'最大值'},
							{type:'min', name:'最小值'}
						]
					},
					markLine:{
						data:[
							{type:'average', name:'平均值'}
						]
					}
				}
			]
		};
	};

	var createChartContainer = function(id){
		var div = $( '<div></div>' );
		div.attr( 'id', id );
		div.addClass( 'trendChart' );
		$( '#trend' ).append( div );
		return {id:id, div:div}
	};

	var renderChart = function(jqObj){
			var metric = jqObj.val();
			var desc = jqObj.attr('desc');
			var yAxisData = getYAxisData( selectedUrl, compUrl, metric, $.xAxisData );
			var id = metric + '_chart';
			chart_list[id] = createChartContainer( id );
			var div = chart_list[id]['div'];
			$( '#trend' ).append( div );
			var chart = echarts.init( document.getElementById( id ), e_macarons );
			chart_list[id].chart = chart;

			if( selectedUrl == compUrl ){
				var legendData = [selectedUrl + '[1]', compUrl + '[2]'];
			}else{
				var legendData = [selectedUrl, compUrl];
			}
			if( yAxisData ){
				chart.setOption( echartsOption( desc, legendData, $.xAxisData, yAxisData.selectedUrl, yAxisData.compUrl ) );
			}

			//滚动到
		$.scrollTo(id);
	}

	var removeChart = function(id){
		var chartInfo = chart_list[id];
		if( chartInfo ){
			if( chartInfo.chart ){
				chartInfo.chart.clear();
				chartInfo.chart.dispose();
			}
			id = '#' + id;
			$( id ).remove();
		}
	}

	var removeAllCharts = function(){
		for( var id in chart_list){
			removeChart( id );
		}
	}

	/**
	 * 设置checkbox
	 */
	$( '.metriclist' ).iCheck( {
		checkboxClass:'icheckbox_flat-green',
		radioClass:'iradio_flat-green',
		increaseArea:'20%' // optional
	} );
	$( '.metriclist' ).on( 'ifChecked', function(e){
		if( $.perfData ){
			renderChart( $(this) );
		}
	} ).on( 'ifUnchecked', function(e){
		var metric = $( this ).val();
		var id = metric + '_chart';
		removeChart( id );
	} );


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
			$.perfData = null;
			$.getCompData( selectedUrl, compUrl, startDate, endDate, function(json){
				preRender( json );
			} )
		}
	} );

	var getXAxisData = function(){

		var len = $.perfData.length;
		var daysObj = {};
		for( var i = 0 ; i< len; i++ ){
			var item = $.perfData[i];
			var day = item.day;
			daysObj[day] = 1;
		}
		var daysArr = [];
		for( var day in daysObj ){
			daysArr.push( day );
		}
		return daysArr;
	}

	var getYAxisData = function(selectedUrl,compUrl,metric,daysArr){
		var len = $.perfData.length;
		var urlData = {};
		for( var i = 0 ; i< len; i++ ){
			var item = $.perfData[i];
			var url = item.url;
			var day = item.day;

			if( !urlData[url] ){
				urlData[url] = {};
			}
			if( !urlData[url][day] ){
				urlData[url][day] = {};
			}
			urlData[url][day] = item[metric];
		}

		var selectUrlData = [];
		var compUrlData = [];
		len = daysArr.length;
		for( var i = 0; i < len; i++ ){
			day = daysArr[i];
			if( urlData[selectedUrl][day] !== undefined ){
				selectUrlData.push( urlData[selectedUrl][day]);
			}else{
				selectUrlData.push( 0 );
			}
			if( urlData[compUrl][day] !== undefined ){
				compUrlData.push( urlData[compUrl][day]);
			}else{
				compUrlData.push( 0 );
			}
		}
		return {selectedUrl:selectUrlData,compUrl:compUrlData};
	}

	/**
	 * 渲染前数据处理
	 * @param json
	 */
	var preRender = function(json){
		if( json && json.code == 0 && json.data && json.data.length > 0 ){
			removeAllCharts();

			$.perfData = json.data;
			$.xAxisData = getXAxisData()
			var checked = $('.metriclist:checkbox:checked');
			var len = checked.length;
			for( var i=0; i < len; i++ ){
				var jqObj = $( checked[i] );
					renderChart( jqObj );
			}
		}else{
			console.log('json data null!');
		}
	}

	/**
	 * url列表
	 * @type {*|jQuery|HTMLElement}
	 */
	var selector = $( '#urls' );
	selector.minimalect( {
		'afterinit':function(){
			var url = $.getUrlParam( 'url' );
			if( !url ){
				selectedUrl = $( '#urls option' )[0].value.toString();
			}
			selector.val( selectedUrl ).change();
		},
		'onchange':function(val, txt){
			selectedUrl = val;
			$.perfData = null;
			$.getCompData( selectedUrl, compUrl, startDate, endDate, function(json){
				preRender( json );
			} );
		}
	} );

	/**
	 * 对比产品url列表
	 * @type {*|jQuery|HTMLElement}
	 */
	var selectorUrlComp = $( '#urls_comp' );
	selectorUrlComp.minimalect( {
		'afterinit':function(){
			var url = $.getUrlParam( 'url' );
			if( !url ){
				compUrl = $( '#urls_comp option' )[0].value.toString();
			}
			selectorUrlComp.val( compUrl ).change();
		},
		'onchange':function(val, txt){
			compUrl = val;
			$.perfData = null;
			$.getCompData( selectedUrl, compUrl, startDate, endDate, function(json){
				preRender( json );
			} );
		}
	} );
} );

