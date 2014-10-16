$(document).ready(function () {
	$('#menu_trend').css('background-color', '#f9f9f9');

	var selectedUrl = '';
	var today = $.getDateStr(0);
	var startDate = $.getDateStr(-7);
	var endDate = today;
	var chart_list = {};

	/**
	 * echart配置
	 *
	 * @param title
	 * @param legendData
	 * @param xAxisData
	 * @param selectedUrlData
	 * @returns {{title: {text: *}, tooltip: {trigger: string}, legend: {data: *}, calculable: boolean, xAxis: {type: string, data: *}[], yAxis: {type: string, name: string, splitNumber: number}[], series: {name: *, type: string, data: *}[]}}
	 */
	var echartsOption = function (title, legendData, xAxisData, selectedUrlData) {
		var selectedUrl = legendData[0];
		return {
			title: {
				text: title
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: legendData
			},
			calculable: true,
			xAxis: [
				{
					type: 'category',
					data: xAxisData
				}
			],
			yAxis: [ // 直角坐标系中纵轴数组
				{
					type: 'value', // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
					name: '',
					splitNumber: 4 // 数值轴用，分割段数，默认为5
				}
			],
			series: [
				{
					name: selectedUrl,
					type: 'line',
					data: selectedUrlData
				}
			]
		};
	};

	/**
	 * echarts图表容器
	 *
	 * @param id
	 * @returns {{id: *, div: (*|jQuery|HTMLElement)}}
	 */
	var createChartContainer = function (id) {
		var div = $('<div></div>');
		div.attr('id', id);
		div.addClass('trendChart');
		$('#trend').prepend(div);
		return {
			id: id,
			div: div
		}
	};

	/**
	 * 渲染echarts图表
	 *
	 * @param jqObj
	 */
	var renderChart = function (jqObj) {
		var metric = jqObj.val();
		var desc = jqObj.attr('desc');
		var yAxisData = getYAxisData(selectedUrl, metric, $.xAxisData);
		var id = metric + '_chart';
		chart_list[id] = createChartContainer(id);
		var div = chart_list[id]['div'];
		$('#trend').prepend(div);
		var chart = echarts.init(document.getElementById(id), e_macarons);
		chart_list[id].chart = chart;

		var legendData = [selectedUrl];
		if (yAxisData) {
			chart.setOption(echartsOption(desc, legendData, $.xAxisData, yAxisData));
		}

		//滚动到
		$.scrollTo('metricslist');
	}

	/**
	 * 删除指定图表
	 *
	 * @param id
	 */
	var removeChart = function (id) {
		var chartInfo = chart_list[id];
		if (chartInfo) {
			if (chartInfo.chart) {
				chartInfo.chart.clear();
				chartInfo.chart.dispose();
			}
			id = '#' + id;
			$(id).remove();
		}
	}

	/**
	 * 删除所有图表
	 */
	var removeAllCharts = function () {
		for (var id in chart_list) {
			removeChart(id);
		}
	}

	/**
	 * 设置checkbox
	 */
	$('.metriclist').iCheck({
		checkboxClass: 'icheckbox_flat-green',
		radioClass: 'iradio_flat-green',
		increaseArea: '20%' // optional
	});
	$('.metriclist').on('ifChecked', function (e) {
		if ($.perfData) {
			renderChart($(this));
		}
	}).on('ifUnchecked', function (e) {
		var metric = $(this).val();
		var id = metric + '_chart';
		removeChart(id);
	})


	/**
	 * 时间选择
	 *
	 */
	var dateRange = new pickerDateRange('date_picker', {
		isTodayValid: true,
		startDate: startDate,
		endDate: endDate,
		autoSubmit: true,
		theme: 'ta',
		defaultText: ' 至 ',
		success: function (obj) {
			startDate = obj['startDate'];
			endDate = obj['endDate'];
			$.getTrendData(selectedUrl, startDate, endDate, function (json) {
				preRender(json);
			})
		}
	});

	/**
	 * 横坐标数据
	 *
	 * @returns {Array}
	 */
	var getXAxisData = function () {
		var len = $.perfData.length;
		var timeObj = {};
		for (var i = 0; i < len; i++) {
			var item = $.perfData[i];
			var runstep = item['runstep'];
			if( runstep == 1 ){
				var time = item.updatedAt;
				timeObj[time] = 1;
			}
		}
		var timeArr = [];
		for (var time in timeObj) {
			timeArr.push(new Date(time).Format("yyyy-MM-dd hh:mm:ss"));
		}
		return timeArr;
	}

	/**
	 * 纵坐标数据
	 *
	 * @param selectedUrl
	 * @param metric
	 * @param daysArr
	 * @returns {Array}
	 */
	var getYAxisData = function (selectedUrl, metric, daysArr) {
		var len = $.perfData.length;
		console.log( $.perfData);
		var urlData = [];
		for (var i = 0; i < len; i++) {
			var item = $.perfData[i];
			var runstep = item['runstep'];
			var metricValue = item[metric];
			if( metricValue < 0 ){
				metricValue = 0;
			}
			if (runstep == 1) {
				urlData.push(metricValue);
			}
		}
		return urlData;
	}

	/**
	 * render前数据处理
	 * @param json
	 */
	var preRender = function (json) {
		if (json && json.code == 0 && json.data && json.data.length > 0) {
			removeAllCharts();

			$.perfData = json.data;
			$.xAxisData = getXAxisData();
			var checked = $('.metriclist:checkbox:checked');
			var len = checked.length;
			for (var i = 0; i < len; i++) {
				var jqObj = $(checked[i]);
				renderChart(jqObj);
			}
		} else {
			console.log('json data null!');
		}
	}

	/**
	 * url选择器
	 *
	 * @type {*|jQuery|HTMLElement}
	 */
	var selector = $('#urls');
	selector.minimalect({
		'afterinit': function () {
			var url = $.getUrlParam('url');
			if (!url) {
				var firstUrl = $('#urls option')[0].value.toString();
				selectedUrl = firstUrl;
			}
			selector.val(selectedUrl).change();
		},
		'onchange': function (val, txt) {
			selectedUrl = val;
			$.getTrendData(val, startDate, endDate, function (json) {
				preRender(json);
			});
		}
	});
});