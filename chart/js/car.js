var TypeValue = "";

function getTypeValue() {
	TypeValue = $("input:radio[name=inquiretype]:checked").val();

	var Range = "";
	var newRange = "";
	var Choice = appchart.message;
	if (appchart.message == "3") {
		Range = appchart.range[0] + "~" + appchart.range[1];
		newRange = Range.replace(/\//g, "-");
	}
	else {
		Range = "";
	}

	$.ajax({
		url: "http://192.168.50.47:8002/api/CarStatus.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			Token: getCookie('token'),
			Type: TypeValue,
			DateChioce: Choice,
			DateRange: newRange,
			Down: "1",
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (evt) {
			var Series = [];
			var time = evt[0].Date; //圖表日期範圍
			// var Total = evt[0].Total;
			var Url = evt[0].Url;
			// 圖表data
			var countIn = $.map(evt[0].IChart, function (item, index) {
				return item.Count;
			})
			var date = $.map(evt[0].IChart, function (item, index) {
				if (Choice == "0") {
					return item.Date + "時";
				}
				else {
					return item.Date;
				}
			})
			var countOut = $.map(evt[0].OChart, function (item, index) {
				return item.Count;
			})
			var barname = "";
			if (TypeValue == "1") {
				barname = "汽車"
			}
			else if (TypeValue == "0") {
				barname = "機車"
			}
			if (Choice != "1" && evt[0].IChart.length > "15") {
				chart.updateOptions({
					xaxis: {
						categories: date
					},
					chart: {
						width: 80 * evt[0].IChart.length,
					}
				});
			}
			else {
				chart.updateOptions({
					xaxis: {
						categories: date
					},
					chart: {
						width: '100%',
					}
				});
			}
			Series.push
				(
					{
						name: barname + '進廠數量',
						data: countIn,
					},
					{
						name: barname + '出廠數量',
						data: countOut,
					}
				)
			chart.updateSeries(Series);
			document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
			document.getElementById("title").innerHTML = barname + "進出廠統計圖";
			document.getElementById("date").innerHTML = "日期：" + time;
		},
		complete: function () {
			$("#overlay").fadeOut(300);
		}
	});

};
// 資料預設
var forapi = new Vue({
	el: '#forapi',
	data: {
		//將ajax寫在這裡面
		carFlowIn: '',
		carFlowOut: '',
		scooterFlowIn: '',
		scooterFlowOut: '',
		message: '0',
	},
	methods: { //methods是關鍵字 
		mainpage: function () {
			let vm = this;
			$.ajax({
				url: "http://192.168.50.47:8002/api/CarStatus.aspx",
				method: "post", //直接傳遞物件
				data: {
					Token: getCookie('token'),
					Type: "1",
					DateChioce: "0",
				},
				beforeSend: function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (evt) {
					vm.message = "";

					$.each(JSON.parse(evt), function (k, item) {
						var data = item.Data;

						for (var i = 0; i < data.length; i++) {
							switch (data[i].Text) {
								case "carFlowIn":
									forapi.carFlowIn = data[i].Count;
									break;
								case "carFlowOut":
									forapi.carFlowOut = data[i].Count;
									break;
								case "scooterFlowIn":
									forapi.scooterFlowIn = data[i].Count;
									break;
								case "scooterFlowOut":
									forapi.scooterFlowOut = data[i].Count;
									break;
							}
						}
					})

				},
				complete: function () {
					setTimeout(forapi.mainpage, 600000);
					var today = new Date();
					var y = today.getFullYear();//年份
					//不足兩位數補零
					var mo = (today.getMonth() + 1 < 10 ? '0' : '') + (today.getMonth() + 1);//月份
					var d = (today.getDate() < 10 ? '0' : '') + today.getDate();//日期
					var h = (today.getHours() < 10 ? '0' : '') + today.getHours();//小時
					var m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();//分鐘
					var s = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();//秒
					var currentDateTime = y + '/' + mo + '/' + d + '/ ' + h + ':' + m + ':' + s;
					document.getElementById('refreshtime').innerHTML = '更新時間：' + currentDateTime;
					$("#overlay").fadeOut(300);
				}
			});
		},
	}
});

// 圖表預設
$(document).ready(function () {
	setTimeout(forapi.mainpage, 1000);
	CookieExist('token', 'car');
	$('#chartbox').css = ('width', 'calc(' + $(window).width() + '-10px)');
	$.ajax({
		url: "http://192.168.50.47:8002/api/CarStatus.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			Token: getCookie('token'),
			Type: "1",
			DateChioce: "0",
			DateRange: "",
			Down: "1",
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (evt) {
			console.log(evt);
			var Series = [];
			var time = evt[0].Date; //圖表日期範圍

			// var Total = evt[0].Total;
			var Url = evt[0].Url;
			// 圖表data
			var countIn = $.map(evt[0].IChart, function (item, index) {
				return item.Count;
			})
			var date = $.map(evt[0].IChart, function (item, index) {
				return item.Date + "時";
			})
			var countOut = $.map(evt[0].OChart, function (item, index) {
				return item.Count;
			})
			// 預設
			$('input:radio[name=inquiretype][id=car]').attr('checked', true);
			TypeValue = "1";
			appchart.message = '0',
				// 寫回圖表
				Series.push
					(
						{
							name: '汽車進廠數量',
							data: countIn,
						},
						{
							name: '汽車出廠數量',
							data: countOut,
						}
					)
				chart.updateOptions({
					xaxis: {
						categories: date
					},
					chart: {
						width: '100%',
					}
				});
			chart.updateSeries(Series);
			document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
			document.getElementById("title").innerHTML = "汽車進出廠統計圖";
			document.getElementById("date").innerHTML = "日期：" + time;
		},
		complete: function () {
			$("#overlay").fadeOut(300);
		}

	});
});

// 圖表預設
var chart;
$(document).ready(function () {
	var option = {
		chart: {
			height: 400,
			type: 'line',
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
		colors: ['#4F1AFA', '#A589FF'],
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
			size: 1
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
		tooltip: {
			shared: true,
			intersect: false,
		},
		legend: {
			position: 'top',
			horizontalAlign: 'left',
			fontSize: '14px',
			fontFamily: 'Helvetica, Arial',
			fontWeight: 400,
			itemMargin: {
				vertical: 10
			},
			formatter: function (seriesName) {
				return '<div class="legend-info">' + '<span>' + seriesName + '</span>' + '</div>'
			}
		},
		noData: {
			text: '尚無資料'
		}
	};
	chart = new ApexCharts(document.querySelector("#chart"), option);
	chart.render();
});


// 圖表切換
let appchart = new Vue({
	el: '#chart_app',
	data: {
		message: '',
		range: '',
		print: '',
	},
	methods: {
		time: function (msg) {
			this.message = msg;
			$("#overlay").fadeIn(1000);
			appchart.Chart('0');
		},
		Chart: function () {
			var Range = "";
			var newRange = "";
			var Choice = appchart.message;
			if (appchart.message == "3") {
				Range = appchart.range[0] + "~" + appchart.range[1];
				newRange = Range.replace(/\//g, "-");
			}
			else {
				Range = "";
			}

			$.ajax({
				url: "http://192.168.50.47:8002/api/CarStatus.aspx",
				method: "post", //直接傳遞物件
				dataType: "json",
				data: {
					Token: getCookie('token'),
					Type: TypeValue,
					DateChioce: Choice,
					DateRange: newRange,
					Down: "1",
				},
				beforeSend: function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (evt) {
					console.log(evt);
					var Series = [];
					var time = evt[0].Date; //圖表日期範圍
					// var Total = evt[0].Total;
					var Url = evt[0].Url;
					// 圖表data
					var countIn = $.map(evt[0].IChart, function (item, index) {
						return item.Count;
					})
					var date = $.map(evt[0].IChart, function (item, index) {
						if (Choice == "0") {
							return item.Date + "時";
						}
						else {
							return item.Date;
						}
					})
					var countOut = $.map(evt[0].OChart, function (item, index) {
						return item.Count;
					})
					var barname = "";
					if (TypeValue == "0") {
						barname = "汽車"
					}
					else if (TypeValue == "1") {
						barname = "機車"
					}
					if (Choice != "1" && evt[0].IChart.length > "15") {
						chart.updateOptions({
							xaxis: {
								categories: date
							},
							chart: {
								width: 80 * evt[0].IChart.length,
							}
						});
					}
					else {
						chart.updateOptions({
							xaxis: {
								categories: date
							},
							chart: {
								width: '100%',
							}
						});
					}
					Series.push
						(
							{
								name: barname + '進廠數量',
								data: countIn,
							},
							{
								name: barname + '出廠數量',
								data: countOut,
							}
						)
					chart.updateSeries(Series);
					document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
					document.getElementById("title").innerHTML = barname + "進出廠統計圖";
					document.getElementById("date").innerHTML = "日期：" + time;
				},
				complete: function () {
					$("#overlay").fadeOut(300);
				}

			})

		}
	}
});
