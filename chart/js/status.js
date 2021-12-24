// 預設資料
$(document).ready(function () {
	CookieExist('token', 'status');
	$('#chartbox').css = ('width', 'calc(' + $(window).width() + '-10px)');
	var url = location.href;
	appchart.message = "0";
	if (url.indexOf('?') != -1) {
		//在此直接將各自的參數資料切割放進ary中
		var ary = url.split('?')[1].split('&');
		var time = ary[0].split('=');
		TypeValue = time[1];
		value = ary[1];
		console.log(TypeValue);
		console.log(value);
		if (TypeValue == "1") {
			$.ajax({
				url: "http://192.168.50.47:8002/api/PersonErrorStatus.aspx",
				dataType: 'json',
				method: "post", //直接傳遞物件
				data: {
					Name: "",
					Token: getCookie('token'),
				},
				beforeSend: function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (data) {
					var html = "";
					document.getElementById('render').innerHTML = "";
					document.getElementById('selectall').innerHTML = "";
					document.getElementById('searchBtn').value = "";
					document.getElementById('submit').classList.remove("A");
					document.getElementById('submit').classList.remove("B");
					document.getElementById('title').innerHTML = "複選";
					var status = "'statusM'";
					for (var i = 0; i < data.length; i++) {
						html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input name="statusM" class="statusM" type="checkbox" id="' + data[i].Name + '" value="' + data[i].Type + '" onclick="setChecked(this,' + status + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
					}
					var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="statusM" id="selectAll" onclick="setChecked(this,' + status + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
					document.getElementById('render').innerHTML = html;
					document.getElementById('selectall').innerHTML = selectAll;
					document.getElementById('searchBtn').value = "1";
					document.getElementById('submit').classList.add("B");
					$('input:checkbox[id=selectAll]').attr('checked', true);
					$('input:checkbox[class=statusM]').attr('checked', true);
					count('statusM');
					Value();
				},
				complete: function () {
					$("#overlay").fadeOut(300);
				}
			});
		}
		else if (TypeValue == "0") {
			$.ajax({
				url: "http://192.168.50.47:8002/api/PersonErrorStatus.aspx",
				dataType: 'json',
				method: "post", //直接傳遞物件
				data: {
					Name: "",
					Token: getCookie('token'),
				},
				beforeSend: function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (data) {
					var html = "";
					//清空確定
					document.getElementById('submit').innerHTML = "確定";
					document.getElementById('render').innerHTML = "";
					document.getElementById('selectall').innerHTML = "";
					document.getElementById('searchBtn').value = "";
					document.getElementById('submit').classList.remove("A");
					document.getElementById('submit').classList.remove("B");
					for (var i = 0; i < data.length; i++) {
						html += '<div style="width:23%;" class="radio mg-10"><input name="statusL"  id="' + data[i].Name + '" value="' + data[i].Type + '"  type="radio" onclick="getSortValue(this)"><label for="' + data[i].Name + '">' + data[i].Name + '</label></div>';
					}
					document.getElementById('render').innerHTML = html;
					document.getElementById('searchBtn').value = "0";
					document.getElementById('submit').classList.add("A");
					document.getElementById('title').innerHTML = "單選";
					$('input:radio[value="' + value + '"]').attr('checked', true);
					InputValue = $("input:radio[name=statusL]:checked").attr('id');
				},
				complete: function () {
					$.ajax({
						url: "http://192.168.50.47:8002/api/Status.aspx",
						method: "post", //直接傳遞物件
						dataType: "json",
						data: {
							Token: getCookie('token'),
							Type: "0",
							DateChioce: "0",
							Result: value,
							DateRange: "",
							Down: "1",
						},
						beforeSend: function () {
							$("#overlay").fadeIn(1000);
						},
						success: function (evt) {
							var error = value; //參數帶到後面
							$('input:radio[name=inquiretype][id=only]').attr('checked', true);
							console.log(evt);
							var Item = function () {
								return {
									name: '',
									type: 'bar',
									data: [],
								}
							};
							value = newallArray;
							var Series = [];
							var time = evt[0].Date; //圖表日期範圍
							console.log(time);
							var newTime1 = time.replace(/\s*/g, "");
							var newTime2 = newTime1.replace(/-/g, "/");
							var newTime = newTime2.replace("~", "-");
							console.log(newTime);
							var Url = evt[0].Url;
							// 圖表各別名稱
							// 圖表data
							var chartdata = $.map(evt[0].Data, function (item, index) {
								return item.Count;
							})
							console.log(chartdata);
							// 圖表x軸名稱
							var chartname = $.map(evt[0].Data, function (item, index) {
								return item.Text;
							})
							console.log(chartname);
							var it = new Item();
							it.data = chartdata;
							it.name = "異常狀態人數";
							Series.push(it);
							chart.updateSeries(Series);
							if (evt[0].Data.length > "15") {
								chart.updateOptions({
									xaxis: {
										categories: chartname,
									},
									chart: {
										width: 120 * evt[0].Data.length,
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
							var boxtitle = "";
							boxtitle = InputValue + "統計圖";
							chart.updateOptions({
								chart: {
									events: { // 添加柱状图数据的点击事件
										click: function (event, chartContext, config) {
											var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
											if (config.dataPointIndex != "-1") {
												console.log(seriesTime);
												window.location.href = "http://192.168.50.47:8002/chart/statustable.html?type=" + seriesTime + "&" + error + "&";
											}
										}
									}
								}

							});
							document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
							document.getElementById("boxtitle").innerHTML = boxtitle;
							document.getElementById("date").innerHTML = "日期：" + time;
							chart.updateSeries(Series);
						},
						complete: function () {
							$("#overlay").fadeOut(300);
						}
					});
					$("#overlay").fadeOut(300);
				}
			});
		}
	}
});


// 單選資料
function getStatusL() {
	$.ajax({
		url: "http://192.168.50.47:8002/api/PersonErrorStatus.aspx",
		method: "post", //直接傳遞物件
		data: {
			Name: "",
			Token: getCookie('token'),
		},
		dataType: 'json',
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (data) {
			var html = "";
			//清空確定
			document.getElementById('submit').innerHTML = "確定";
			document.getElementById('render').innerHTML = "";
			document.getElementById('selectall').innerHTML = "";
			document.getElementById('searchBtn').value = "";
			document.getElementById('submit').classList.remove("A");
			document.getElementById('submit').classList.remove("B");
			for (var i = 0; i < data.length; i++) {
				html += '<div style="width:23%;" class="radio mg-10"><input name="statusL"  id="' + data[i].Name + '" value="' + data[i].Type + '"  type="radio" onclick="getSortValue(this)"><label for="' + data[i].Name + '">' + data[i].Name + '</label></div>';
			}
			document.getElementById('render').innerHTML = html;
			document.getElementById('searchBtn').value = "0";
			document.getElementById('submit').classList.add("A");
			document.getElementById('title').innerHTML = "單選";
		},
		complete: function () {
			$('input:radio[value="1"]').attr('checked', true);
			InputValue = $("input:radio[name=statusL]:checked").attr('id');
			getSortValue();
			value = SortValue;
			ajax();
		}
	});
};

// 複選資料
function getStatusM() {
	$.ajax({
		url: "http://192.168.50.47:8002/api/PersonErrorStatus.aspx",
		method: "post", //直接傳遞物件
		data: {
			Name: "",
			Token: getCookie('token'),
		},
		dataType: 'json',
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (data) {
			var html = "";
			//清空確定
			document.getElementById('submit').innerHTML = "確定";
			document.getElementById('render').innerHTML = "";
			document.getElementById('selectall').innerHTML = "";
			document.getElementById('searchBtn').value = "";
			document.getElementById('submit').classList.remove("A");
			document.getElementById('submit').classList.remove("B");
			var status = "'statusM'";
			for (var i = 0; i < data.length; i++) {
				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input name="statusM" class="statusM" type="checkbox" id="' + data[i].Name + '" value="' + data[i].Type + '" onclick="setChecked(this,' + status + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
			}
			var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="statusM" id="selectAll" onclick="setChecked(this,' + status + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
			document.getElementById('render').innerHTML = html;
			document.getElementById('selectall').innerHTML = selectAll;
			document.getElementById('searchBtn').value = "1";
			document.getElementById('submit').classList.add("B");
			document.getElementById('title').innerHTML = "複選";
		},
		complete: function () {
			Type = "1";
			TypeValue = "1";
			$('input:checkbox[id=selectAll]').attr('checked', true);
			$('input:checkbox[class=statusM]').attr('checked', true);
			count('statusM');
			getValue();
		}
	});
};


// 查詢按鈕
$("#searchBtn").click(function () {
	var search = $("#searchBtn").val();
	var searchText = $("#search").val(); //取得input值
	// 組室資料
	if (search == "0") {
		console.log(searchText);
		$.ajax({
			url: "http://192.168.50.47:8002/api/PersonErrorStatus.aspx",
			dataType: 'json',
			method: "post",
			data: {
				Token: getCookie('token'),
				type: '0',
				Name: searchText,
			},
			beforeSend: function () {
				$("#overlay").fadeIn(1000);
			},
			success: function (data) {
				console.log(data);
				var html = "";
				document.getElementById('render').innerHTML = "";
				document.getElementById('selectall').innerHTML = "";
				document.getElementById('submit').classList.remove("A");
				document.getElementById('submit').classList.remove("B");
				for (var i = 0; i < data.length; i++) {
					html += '<div style="width:23%;" class="radio mg-10"><input name="statusL"  id="' + data[i].Name + '" value="' + data[i].Type + '"  type="radio" onclick="getSortValue(this)"><label for="' + data[i].Name + '">' + data[i].Name + '</label></div>';
				}
				document.getElementById('render').innerHTML = html;
				document.getElementById('submit').classList.add("A");
				document.getElementById('title').innerHTML = "單選";
			},
			complete: function () {
				$("#overlay").fadeOut(300);
			}
		});
	}
	// 區域資料
	else if (search == "1") {
		$.ajax({
			url: "http://192.168.50.47:8002/api/PersonErrorStatus.aspx",
			dataType: 'json',
			method: "post",
			data: {
				Token: getCookie('token'),
				type: '1',
				Name: searchText,
			},
			beforeSend: function () {
				$("#overlay").fadeIn(1000);
			},
			success: function (data) {
				console.log(data);
				var html = "";
				document.getElementById('render').innerHTML = "";
				document.getElementById('selectall').innerHTML = "";
				document.getElementById('submit').classList.remove("A");
				document.getElementById('submit').classList.remove("B");
				var status = "'statusM'";
				for (var i = 0; i < data.length; i++) {
					html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input name="statusM" class="statusM" type="checkbox" id="' + data[i].Name + '" value="' + data[i].Type + '" onclick="setChecked(this,' + status + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
				}
				var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="statusM" id="selectAll" onclick="setChecked(this,' + status + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
				document.getElementById('render').innerHTML = html;
				document.getElementById('selectall').innerHTML = selectAll;
				document.getElementById('searchBtn').value = "1";
				document.getElementById('submit').classList.add("B");
				document.getElementById('title').innerHTML = "複選";
			},
			complete: function () {
				$("#overlay").fadeOut(300);
			}
		});
	}
});
var Type = "";
var allArray = [];
var newallArray = "";
var TypeValue = "";
var SortValue = "";
var InputValue = "";

// 計算數量
function count(name) {
	var numberOfChecked = $('.' + name + ':checked').length;
	document.getElementById('submit').innerHTML = "確定(" + numberOfChecked + ")";
}

function getValue() {
	var allArray = [];
	var newallArray = "";
	var arrayname = document.getElementById('selectAll').name;
	$("." + arrayname + ":checked").each(function () {
		allArray.push($(this).val());
	});
	newallArray = allArray.join(',') + ",";
	value = newallArray;
	ajax();
}

function Value() {
	var allArray = [];
	var newallArray = "";
	var arrayname = document.getElementById('selectAll').name;
	$("." + arrayname + ":checked").each(function () {
		allArray.push($(this).val());
	});
	newallArray = allArray.join(',') + ",";
	$.ajax({
		url: "http://192.168.50.47:8002/api/Status.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			Token: getCookie('token'),
			Type: "1",
			DateChioce: "0",
			Result: newallArray,
			DateRange: "",
			Down: "1",
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (evt) {
			$('input:radio[name=inquiretype][id=multiple]').attr('checked', true);
			console.log(evt);
			var Item = function () {
				return {
					name: '',
					type: 'bar',
					data: [],
				}
			};
			value = newallArray;
			var Series = [];
			var time = evt[0].Date; //圖表日期範圍
			console.log(time);
			var newTime1 = time.replace(/\s*/g, "");
			var newTime2 = newTime1.replace(/-/g, "/");
			newTime = newTime2.replace("~", "-");
			console.log(newTime);
			var Url = evt[0].Url;
			// 圖表各別名稱
			// 圖表data
			var chartdata = $.map(evt[0].Data, function (item, index) {
				return item.Count;
			})
			// 圖表x軸名稱
			var chartname = $.map(evt[0].Data, function (item, index) {
				return item.Text;
			})
			var it = new Item();
			it.data = chartdata;
			it.name = "異常狀態人數";
			Series.push(it);
			chart.updateSeries(Series);
			if (evt[0].Data.length > "15") {
				chart.updateOptions({
					xaxis: {
						categories: chartname,
					},
					chart: {
						width: 120 * evt[0].Data.length,
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
			var boxtitle = "";
			boxtitle = "異常狀態統計圖";
			chart.updateOptions({
				chart: {
					events: { // 添加柱状图数据的点击事件
						click: function (event, chartContext, config) {
							seriesValue = "";
							seriesTime = config.globals.categoryLabels[config.dataPointIndex];
							find();
						}
					}
				}
			});
			document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
			document.getElementById("boxtitle").innerHTML = boxtitle;
			document.getElementById("date").innerHTML = "日期：" + time;
			chart.updateSeries(Series);
		},
		complete: function () {
			$("#overlay").fadeOut(300);
			newallArray = "";
		}
	});
}

// radio value type陣列
function getTypeValue() {
	TypeValue = $("input:radio[name=inquiretype]:checked").val();
};

// radio value sort陣列
function getSortValue() {
	SortValue = $("input:radio[name=statusL]:checked").val();
	InputValue = $("input:radio[name=statusL]:checked").attr('id');
};



// checkbox全選反選 
function setChecked(obj, name) {
	var inputname = document.getElementsByName(name);
	if (obj.id == "selectAll") {
		for (var i = 0; i < inputname.length; i++) {
			if (obj.checked == true) {
				inputname[i].checked = true;
			}
			else {
				inputname[i].checked = false;
			}
		}
	}
	else {
		if (inputname[0].checked = true) {
			inputname[0].checked = false;
		}
	}
	count(name);
};

var value = "";
$("#submit").click(function () {
	if ($("#submit").hasClass("A")) {
		getSortValue('statusL');
		value = SortValue;
		ajax();
	}
	else if ($("#submit").hasClass("B")) {
		Value();
	}

});

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
			curve: 'smooth',
			width: 0
		},
		grid: {
			borderColor: '#e7e7e7',
			row: {
				colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
				opacity: 0.5
			},
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
			showForSingleSeries: true, //即使只有一種類別也要顯示legend
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
	chart = new ApexCharts(document.querySelector("#main"), option);
	chart.render();
});

let appchart = new Vue({
	el: '#chart_app',
	data: {
		message: '',
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

function find() {
	if (seriesTime == "無此人資料(卡)") {
		seriesValue = "1";
	}
	else if (seriesTime == "無此人資料(臉)") {
		seriesValue = "2";
	}
	else if (seriesTime == "代刷") {
		seriesValue = "3";
	}
	else if (seriesTime == "黑名單") {
		seriesValue = "4";
	}
	else if (seriesTime == "走錯刷卡點") {
		seriesValue = "5";
	}
	else if (seriesTime == "未受工安訓練") {
		seriesValue = "6";
	}
	else if (seriesTime == "工作證逾期") {
		seriesValue = "7";
	}
	else if (seriesTime == "工作證無效") {
		seriesValue = "8";
	}
	else if (seriesTime == "未申請加班") {
		seriesValue = "9";
	}
	else if (seriesTime == "出廠逾時") {
		seriesValue = "10";
	}
	else if (seriesTime == "尚未刷進廠(廠內)") {
		seriesValue = "11";
	}
	else if (seriesTime == "尚未刷出廠(廠內)") {
		seriesValue = "12";
	}
	else if (seriesTime == "鎖卡") {
		seriesValue = "13";
	}
	else if (seriesTime == "解卡") {
		seriesValue = "14";
	}
	else if (seriesTime == "未開卡") {
		seriesValue = "15";
	}
	else if (seriesTime == "尚未刷進廠") {
		seriesValue = "16";
	}
	else if (seriesTime == "尚未刷出廠") {
		seriesValue = "17";
	}
	if (seriesValue != "") {
		console.log("a");
		window.location.href = "http://192.168.50.47:8002/chart/statustable.html?type=" + newTime + "&" + seriesValue + "&";
	}
};
function ajax() {
	var url = location.href;
	if(value==""){
		var ary = url.split('?')[1].split('&');
		value = ary[1];
	}
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
	console.log(TypeValue);
	console.log(Choice);
	console.log(value);
	console.log(newRange);
	$.ajax({
		url: "http://192.168.50.47:8002/api/Status.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			Token: getCookie('token'),
			Type: TypeValue,
			DateChioce: Choice,
			Result: value,
			DateRange: newRange,
			Down: "1",
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (evt) {
			console.log(evt);
			var Item = function () {
				return {
					name: '',
					type: 'bar',
					data: [],
				}
			};
			var Series = [];
			var time = evt[0].Date; //圖表日期範圍
			console.log(time);
			var newTime1 = time.replace(/\s*/g, "");
			console.log(newTime1);
			var newTime2 = newTime1.replace(/-/g, "/");
			console.log(newTime2);
			newTime = newTime2.replace("~", "-");
			console.log(newTime);
			var Url = evt[0].Url;
			// 圖表各別名稱
			// 圖表data
			var chartdata = $.map(evt[0].Data, function (item, index) {
				return item.Count;
			})
			// 圖表x軸名稱
			var chartname = $.map(evt[0].Data, function (item, index) {
				return item.Text;
			})
			var it = new Item();
			it.data = chartdata;
			it.name = "異常狀態人數";
			Series.push(it);
			var boxtitle = "";
			if (TypeValue == "0") {
				if (Choice == "3" && evt.length > "15") {
					chart.updateOptions({
						xaxis: {
							categories: chartname,
						},
						chart: {
							width: 120 * evt[0].Data.length,
						}
					});
				}
				else if (Choice == "2") {
					chart.updateOptions({
						xaxis: {
							categories: chartname,
						},
						chart: {
							width: 120 * evt[0].Data.length,
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
				boxtitle = InputValue + "統計圖";
				chart.updateOptions({
					chart: {
						events: { // 添加柱状图数据的点击事件
							click: function (event, chartContext, config) {
								var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
								if (config.dataPointIndex != "-1") {
									console.log(seriesTime);
									window.location.href = "http://192.168.50.47:8002/chart/statustable.html?type=" + seriesTime + "&" + value + "&";
								}
							}
						}
					}

				});
			}
			else if (TypeValue == "1") {
				if (evt.length > "15") {
					chart.updateOptions({
						xaxis: {
							categories: chartname,
						},
						chart: {
							width: 120 * evt[0].Data.length,
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
				boxtitle = "異常狀態統計圖";
				chart.updateOptions({
					chart: {
						events: { // 添加柱状图数据的点击事件
							click: function (event, chartContext, config) {
								seriesValue = "";
								seriesTime = config.globals.categoryLabels[config.dataPointIndex];
								find();
							}
						}
					}
				});
			}
			document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
			document.getElementById("boxtitle").innerHTML = boxtitle;
			document.getElementById("date").innerHTML = "日期：" + time;
			chart.updateSeries(Series);
		},
		complete: function () {
			$("#overlay").fadeOut(300);
			newallArray = "";
		}

	})
}