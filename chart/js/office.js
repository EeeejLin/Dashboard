$(document).ready(function () {
	CookieExist('token', 'office');
	$('#chartbox').css = ('width', 'calc(' + $(window).width() + '-10px)');
	$('input:radio[name=inquiretype][id=typeFFCP]').attr('checked', true); //預設第一階層篩選
	$('input:radio[name=sortA][id=Factory]').attr('checked', true); //預設第二階層篩選
	TypeValue = "0";
	SortValue = "0";
	var searchText = "";
	$.ajax({
		url: "http://192.168.50.47:8002/api/WorkOfficeTable.aspx",
		method: "post", //直接傳遞物件
		dataType: 'json',
		data: {
			Token: getCookie('token'),
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (data) {
			var html = "";
			document.getElementById('office').innerHTML = "";
			for (var i = 0; i < data.length; i++) {
				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="office" type="checkbox" name="office" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this)"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
			}
			document.getElementById('office').innerHTML = html;
			$('input:checkbox[id=selectAll]').attr('checked', true); //預設全選篩選
			$('input:checkbox[class=office]').attr('checked', true); //預設組室資料全選
			count();
			OfficeValue();
		},
		complete: function () {
			//預設ajax
			$.ajax({
				url: "http://192.168.50.47:8002/api/WorkOfficeChart.aspx",
				method: "post", //直接傳遞物件
				dataType: "json",
				data: {
					InquireTime: "日",
					InquireType: TypeValue,
					Workoffice: newOfficeArray,
					Sort: SortValue,
					Export: "1",
					Token: getCookie('token'),
				},
				beforeSend: function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (evt) {
					console.log(evt);
					var workPeople = "";
					var Contract = "";
					var People = "";
					var InPeople = "";
					var Company = "";
					var Series = [];
					var json = evt.setXcontent; //X軸資料
					var jsona = evt.setData; //數值
					var time = evt.Time; //圖表日期範圍
					var Url = evt.Url;//圖表匯出
					var Title = evt.Title;//圖表標題

					if (TypeValue == "0") {
						for (var i = 0; i < jsona.length; i++) {
							if (jsona[i].setName == "點工上工人數") {
								workPeople = jsona[i].setData;
							}
							else if (jsona[i].setName == "發包數量") {
								Contract = jsona[i].setData;
							}
							else if (jsona[i].setName == "廠內無效人力人數") {
								People = jsona[i].setData;
							}
							else if (jsona[i].setName == "機組區無效人力人數") {
								InPeople = jsona[i].setData;
							}
						}
						console.log(workPeople);
						console.log(Contract);
						console.log(People);
						console.log(InPeople);

						//圖表render
						Series.push
							(
								{
									name: '點工上工人數',
									data: workPeople,
									type: 'bar',
								},
								{
									name: '廠內無效人力人數',
									data: People,
									type: 'bar',
								},
								{
									name: '機組區無效人力人數',
									data: InPeople,
									type: 'bar',
								},
								{
									name: '發包數量',
									data: Contract,
									type: 'line',
								}
							)
						chart.updateSeries(Series);
						if (json.length > "10") {
							chart.updateOptions({
								chart: {
									width: 200 * json.length,
								},
							});
						}
						else {
							chart.updateOptions({
								chart: {
									width: "100%",
								},
							});
						}
						chart.updateOptions({
							chart: {
								events: { // 添加數據點擊事件
									click: function (event, chartContext, config) {
										if (event.srcElement.instance._stroke == "#00AFD0") {
											var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
											if (config.dataPointIndex != "-1") {
												window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "0" + "&" + "0" + "&" + seriesTime + "&";
											}
										}
										else if (event.srcElement.instance._stroke == "#007F97") {
											var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
											if (config.dataPointIndex != "-1") {
												window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "1" + "&" + "0" + "&" + seriesTime + "&";
											}
										}
									}
								}
							},
							xaxis: {
								categories: json,
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
							}
						});
					}
					else if (TypeValue == "1") {
						var Company = jsona[0].setData;
						var Contract = jsona[1].setData;

						//圖表render
						Series.push
							(
								{
									name: '承攬公司數量',
									data: Company,
									type: 'bar',
								},
								{
									name: '發包數量',
									data: Contract,
									type: 'bar',
								}
							)
						chart.updateSeries(Series);

					}
					if (json.length > "10") {
						chart.updateOptions({
							chart: {
								width: 200 * json.length,
							},
						});
					}
					else {
						chart.updateOptions({
							chart: {
								width: "100%",
							},
						});
					}
					chart.updateOptions({
						chart: {
							events: { // 添加數據點擊事件
								click: function (event, chartContext, config) {
									if (event.srcElement.instance._stroke == "#00AFD0") {
										var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
										if (config.dataPointIndex != "-1") {
											window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "0" + "&" + "0" + "&" + seriesTime + "&";
										}
									}
									else if (event.srcElement.instance._stroke == "#007F97") {
										var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
										if (config.dataPointIndex != "-1") {
											window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "1" + "&" + "0" + "&" + seriesTime + "&";
										}
									}
								}
							}
						},
						xaxis: {
							categories: json,
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
						}
					});
					document.getElementById("title_chart").innerHTML = Title;
					document.getElementById("date").innerHTML = "日期：" + time;
					document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;

				},
				complete: function () {
					$("#overlay").fadeOut(300);
				}

			})

		}
	});
});


//查詢按鈕
$("#searchBtn").click(function () {
	var searchText = $("#search").val(); //取得input值
	$('input:checkbox[id=selectAll]').attr('checked', false);
	$.ajax({
		url: "http://192.168.50.47:8002/api/WorkOfficeTable.aspx",
		method: "post",
		data: {
			Token: getCookie('token'),
			Name: searchText,
		},
		dataType: 'json',
		success: function (data) {
			var html = ""; //清除上次所選文字內容
			document.getElementById('submit').innerHTML = "確定";
			document.getElementById('office').innerHTML = ""; //清除上次所選文字內容
			$.each(data, function (k, item) {
				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="office" type="checkbox" name="office" id="' + item.Name + '" value="' + item.Name + '" onclick="setChecked(this)"><label for="' + item.Name + '"></label><span>' + item.Name + '</span></div></div></div>';
			});
			document.getElementById('office').innerHTML = html;
		}
	});
});

var OfficeArray = [];
var newOfficeArray = "";
var TypeValue = "";
var SortValue = "";

// 計算數量
function count() {
	var numberOfChecked = $('.office:checked').length;
	document.getElementById('submit').innerHTML = "確定(" + numberOfChecked + ")";
}

// checkbox value陣列
function getOfficeValue() {

	OfficeArray = [];
	newOfficeArray = "";

	$(".office:checked").each(function () {
		OfficeArray.push($(this).val());
	});
	newOfficeArray = OfficeArray.join(',') + ",";
	ajax();
}

// checkbox value陣列
function OfficeValue() {
	$(".office:checked").each(function () {
		OfficeArray.push($(this).val());
	});
	newOfficeArray = OfficeArray.join(',') + ",";
}


// radio value type陣列
function getTypeValue() {
	TypeValue = $("input:radio[name=inquiretype]:checked").val();
};

// radio value sort陣列
function getSortValue(inputName) {
	SortValue = $("input:radio[name=" + inputName + "]:checked").val();
	ajax();
};



// checkbox全選反選 
function setChecked(obj) {
	var office = document.getElementsByName("office");
	if (obj.id == "selectAll") {
		for (var i = 0; i < office.length; i++) {
			if (obj.checked == true) {
				office[i].checked = true;
			}
			else {
				office[i].checked = false;
			}
		}
	}
	else {
		if (office[0].checked = true) {
			office[0].checked = false;
		}
	}
	count();
}

// 設定圖表render
function typechange(type) {
	$(".SortA").css("display", "none");
	$(".SortB").css("display", "none");
	if (type.value == 0) {
		$(".SortA").css("display", "flex");
		$(".SortB").css("display", "none");
		$('input:radio[name=sortA][id=officesortA]').attr('checked', true);
		TypeValue = "0";
	} else {
		$(".SortA").css("display", "none");
		$(".SortB").css("display", "flex");
		$('input:radio[name=sortB][id=Company]').attr('checked', true);
		TypeValue = "1";
	}
	//Radio change 收合開啟
	$('input[type="radio"][name="inquiretype"]').on('click change', function (e) {
		// console.log(e.type);
		$('#title').addClass('active_accordion');
		$('.confirm,.search,#renderout').css('display', 'inline-block');
	});
	SortValue = "0";
	ajax()
}

// 設定圖表render
var chart;
$(document).ready(function () {
	var option = {
		chart: {
			height: 400,
			stacked: false,
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
		plotOptions: {
			bar: {
				columnWidth: "20%"
			}
		},
		colors: ["#A8D9E2", "#00AFD0", "#007F97", "#005B6B"],
		dataLabels: {
			enabled: true,
		},
		stroke: {
			width: [0, 0, 0, 5],
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
		fill: {
			opacity: [1, 1, 1, 1],
		},
		tooltip: {
			shared: true,
			intersect: false,
		},
		noData: {
			text: '尚無資料'
		}
	};
	chart = new ApexCharts(document.querySelector("#main"), option);
	chart.render();
})

let appchart = new Vue({
	el: '#chart_app',
	data: {
		message: '日',
		range: '',
		print: '0',

	},
	methods: {
		time: function (msg) {
			this.message = msg;
			$("#overlay").fadeIn(1000);
			appchart.Chart('0');
		},
		Chart: function () {
			ajax();
		}
	}
});

function ajax() {
	var Range = "";
	if (appchart.message == "自訂") {
		Range = appchart.range[0] + "-" + appchart.range[1];
	}
	else {
		Range = appchart.message;
	}
	// console.log(Range);
	// console.log(TypeValue);
	// console.log(newOfficeArray);
	// console.log(SortValue);

	$.ajax({
		url: "http://192.168.50.47:8002/api/WorkOfficeChart.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			InquireTime: Range,
			InquireType: TypeValue,
			Workoffice: newOfficeArray,
			Sort: SortValue,
			Export: "1",
			Token: getCookie('token'),
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (evt) {
			console.log(evt);
			var workPeople = "";
			var Contract = "";
			var People = "";
			var InPeople = "";
			var Company = "";
			var Series = [];
			var json = evt.setXcontent; //X軸資料
			var jsona = evt.setData; //數值
			var time = evt.Time; //圖表日期範圍
			var Url = evt.Url;//圖表匯出
			var Title = evt.Title;//圖表標題


			if (TypeValue == "0") {
				for (var i = 0; i < jsona.length; i++) {
					if (jsona[i].setName == "點工上工人數") {
						workPeople = jsona[i].setData;
					}
					else if (jsona[i].setName == "發包數量") {
						Contract = jsona[i].setData;
					}
					else if (jsona[i].setName == "廠內無效人力人數") {
						People = jsona[i].setData;
					}
					else if (jsona[i].setName == "機組區無效人力人數") {
						InPeople = jsona[i].setData;
					}
				}
				console.log(workPeople);
				console.log(Contract);
				console.log(People);
				console.log(InPeople);
				Series.push
					(
						{
							name: '點工上工人數',
							data: workPeople,
							type: 'bar',
						},
						{
							name: '廠內無效人力人數',
							data: People,
							type: 'bar',
						},
						{
							name: '機組區無效人力人數',
							data: InPeople,
							type: 'bar',
						},
						{
							name: '發包數量',
							data: Contract,
							type: 'line',
						}
					)
				chart.updateSeries(Series);
				if (json.length > "10") {
					chart.updateOptions({
						chart: {
							width: 200 * json.length,
						},
					});
				}
				else {
					chart.updateOptions({
						chart: {
							width: "100%",
						},
					});
				}
				chart.updateOptions({
					chart: {
						events: { // 添加數據點擊事件
							click: function (event, chartContext, config) {
								if (event.srcElement.instance._stroke == "#00AFD0") {
									var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
									if (config.dataPointIndex != "-1") {
										window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "0" + "&" + "0" + "&" + seriesTime + "&";
									}
								}
								else if (event.srcElement.instance._stroke == "#007F97") {
									var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
									if (config.dataPointIndex != "-1") {
										window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "1" + "&" + "0" + "&" + seriesTime + "&";
									}
								}
							}
						}
					},
					xaxis: {
						categories: json,
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
					}
				});
			}
			else if (TypeValue == "1") {
				var Company = jsona[0].setData;
				var Contract = jsona[1].setData;

				Series.push
					(
						{
							name: '承攬公司數量',
							data: Company,
							type: 'bar',
						},
						{
							name: '發包數量',
							data: Contract,
							type: 'bar',
						}
					)
				chart.updateSeries(Series);

			}
			chart.updateOptions({
				chart: {
					events: { // 添加數據點擊事件
						click: function (event, chartContext, config) {
							if (event.srcElement.instance._stroke == "#00AFD0") {
								var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
								if (config.dataPointIndex != "-1") {
									window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "0" + "&" + "0" + "&" + seriesTime + "&";
								}
							}
							else if (event.srcElement.instance._stroke == "#007F97") {
								var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
								if (config.dataPointIndex != "-1") {
									window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "1" + "&" + "0" + "&" + seriesTime + "&";
								}
							}
						}
					}
				},
				xaxis: {
					categories: json,
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
				}
			});
			if (json.length > "10") {
				chart.updateOptions({
					chart: {
						width: 200 * json.length,
					},
				});
			}
			else {
				chart.updateOptions({
					chart: {
						width: "100%",
					},
				});
			}
			document.getElementById("title_chart").innerHTML = Title;
			document.getElementById("date").innerHTML = "日期：" + time;
			document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;

		},
		complete: function () {
			$("#overlay").fadeOut(300);
		}

	})
}