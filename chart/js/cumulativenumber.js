// 設定圖表render
var chart;
$(document).ready(function () {
	var option = {
		chart: {
			height: 400,
			dropShadow: {
				enabled: true,
				color: '#000',
				top: 18,
				left: 7,
				blur: 10,
				opacity: 0.2
			},
			toolbar: {
				show: false,
			}
		},
		colors: ['#FDA000'],
		dataLabels: {
			enabled: true,
		},
		stroke: {
			curve: 'straight'
		},
		grid: {
			borderColor: '#e7e7e7',
		},
		markers: {
			size: 6
		},
		series: [

		],
		xaxis: {
			labels: {
				show: true,
				rotate: 0,
				trim: true,
				style: {
					fontSize: '12px',
				},
			},
			categories: [],

		},
		yaxis: {
			min: 0,
			forceNiceScale: true,
			decimalsInFloat: 0,
			labels: {
				formatter: (value) => {
					return parseInt(value);
				},
			}
		},
		labels: [
			//日期陣列
		],
		tooltip: {
			shared: true,
			intersect: false,
		},
		legend: {
			position: 'top',
			horizontalAlign: 'left',
			show: true,
			fontSize: '14px',
			fontFamily: 'Helvetica, Arial',
			fontWeight: 400,
			showForSingleSeries: true, //即使只有一種類別也要顯示legend
			itemMargin: {
				vertical: 10
			},
		},
		noData: {
			text: '尚無資料',
		}
	};
	chart = new ApexCharts(document.querySelector("#main"), option);
	chart.render();
})

$(document).ready(function () {
	CookieExist('token', 'cumulativenumber');
	document.getElementById('chartbox').style.width = 'calc(' + $(window).width() + '-10px)';
	$.ajax({
		url: "http://192.168.50.47:8002/api/CumulativeNumber.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			Token: getCookie('token'),
			Type: "3",
			Down: "1",
			Day: "",
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (evt) {
			console.log(evt);
			var Item = function () {
				return {
					name: '',
					type: 'line',
					data: [],
				}
			};
			var Series = [];
			var time = evt[0].Date; //圖表日期範圍
			var Url = evt[0].Url;
			// 圖表各別名稱
			// 圖表data
			var chartdata = $.map(evt[0].Data, function (item, index) {
				return item.Count;
			})
			// 圖表x軸名稱
			var chartname = $.map(evt[0].Data, function (item, index) {
				return item.Text + "時";
			})
			console.log(chartdata);
			console.log(chartname);
			appchart.message = "3";
			var it = new Item();
			it.data = chartdata;
			it.name = "累積進廠人次";
			Series.push(it);
			chart.updateSeries(Series);
			chart.updateOptions({
				xaxis: {
					categories: chartname,
				},
				chart: {
					width: '100%',
				}
			});
			document.getElementById("date").innerHTML = "日期：" + time;
			document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
		},
		complete: function () {
			$("#overlay").fadeOut(300);
		}
	});
});

let appchart = new Vue({
	el: '#chart_app',
	data: {
		message: '3',
		range: '',
		print: '0',

	},
	methods: {
		time: function (msg) {
			this.message = msg;
			$("#overlay").fadeIn(1000);
			appchart.Chart('0');
		},
		childByValue: function (name, text) {
			this.select = name;
			this.text = text;
			select = name;
			$("#overlay").fadeIn(1000);
			appchart.Chart('0');

		},
		Chart: function () {

			var Range = "";
			var Choice = appchart.message;
			if (appchart.message == "4") {
				Range = appchart.range[0] + "-" + appchart.range[1];
			}
			else {
				Range = "";
			}

			console.log(Choice);
			console.log(Range);

			$.ajax({
				url: "http://192.168.50.47:8002/api/CumulativeNumber.aspx",
				method: "post", //直接傳遞物件
				dataType: "json",
				data: {
					Token: getCookie('token'),
					Type: Choice,
					Down: "1",
					Day: Range,
				},
				beforeSend: function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (evt) {
					console.log(evt);
					var Item = function () {
						return {
							name: '',
							type: 'line',
							data: [],
						}
					};
					var Series = [];
					var time = evt[0].Date; //圖表日期範圍
					var Url = evt[0].Url;
					// 圖表各別名稱
					// 圖表data
					var chartdata = $.map(evt[0].Data, function (item, index) {
						return item.Count;
					})

					// 圖表x軸名稱
					var chartname = $.map(evt[0].Data, function (item, index) {
						if (Choice == "3") {
							return item.Text + "時";
						}
						else {
							return item.Text;
						}
					})

					var it = new Item();
					it.data = chartdata;
					it.name = "累積進廠人次";
					Series.push(it);
					console.log(evt[0].Data.length);
					chart.updateSeries(Series);
					if (Choice == "4" && evt[0].Data.length > "15") {
						chart.updateOptions({
							xaxis: {
								categories: chartname,
							},
							chart: {
								width: 80 * evt[0].Data.length,
							}
						});
					}
					else if (Choice == "0" && evt[0].Data.length > "15") {
						chart.updateOptions({
							xaxis: {
								categories: chartname,
							},
							chart: {
								width: 80 * evt[0].Data.length,
							}
						});

					}
					else {
						chart.updateOptions({
							xaxis: {
								categories: chartname,
							},
							chart: {
								width: '100%',
							}
						});
					}

					document.getElementById("date").innerHTML = "日期：" + time;
					document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;

				},
				complete: function () {
					$("#overlay").fadeOut(300);
				}

			})


		}
	}
});