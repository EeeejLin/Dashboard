// Kiosk資料
$(document).ready(function () {
	$('#chartbox').css = ('width', 'calc(' + $(window).width() + '-10px)');
	CookieExist('token', 'face');
	$('input:radio[name=inquiretype][id=kiosk]').attr('checked', true); //預設顯示通道刷卡機
	TypeValue = "0";
	startValue();
});

// radio value type陣列

var TypeValue = "";
var allArray = [];
var newallArray = "";

function getTypeValue() {
	TypeValue = $("input:radio[name=inquiretype]:checked").val();
	getValue();
};

// 計算數量
function count() {
	var numberOfChecked = $('.kiosk:checked').length;
	document.getElementById('submit').innerHTML = "確定(" + numberOfChecked + ")";
};

// checkbox value陣列
function getKioskValue() {

	allArray = [];
	newallArray = "";

	$(".kiosk:checked").each(function () {
		allArray.push($(this).val());
		newallArray = allArray.join(',');
	});

	var Range = "";
	if (appchart.message == "自訂") {
		Range = appchart.range[0] + "-" + appchart.range[1];
	}
	else {
		Range = appchart.message;
	}
	console.log(newallArray);
	$.ajax({
		url: "http://192.168.50.47:8002/api/FacePass.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			Token: getCookie('token'),
			InquireTime: Range,
			InquireType: TypeValue,
			Name: newallArray,
			Export: "1",
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (jsons) {
			console.log(jsons);
			var countSuccess = "";
			var countFail = "";
			var Series = [];
			var json = jsons.setXcontent; //X軸資料
			var jsona = jsons.Data; //數值
			var time = jsons.Time; //圖表日期範圍
			var Url = jsons.Url;//圖表匯出
			// var RateSuccess = jsona[1].setRate;
			var countSuccess = jsona[1].setData;
			// var RateFail = jsona[0].setRate;
			var countFail = jsona[0].setData;
			if (json.length > "15") {
				chart.updateOptions({
					xaxis: {
						categories: json,
					},
					chart: {
						width: 120 * json.length,
					},
				});
			}
			else {
				chart.updateOptions({
					xaxis: {
						categories: json,
					},
					chart: {
						width: '100%',
					},
				});
			}
			Series.push
				(
					{
						name: '通關失敗人數',
						data: countFail,
						type: 'bar',
					},
					{
						name: '通關成功人數',
						data: countSuccess,
						type: 'bar',
					}
				)
			chart.updateSeries(Series);
			document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
			document.getElementById("date").innerHTML = "日期：" + time;
		},
		complete: function () {
			$("#overlay").fadeOut(300);
		}

	})

}


// checkbox value陣列
function KioskValue() {
	allArray = [];
	newallArray = "";
	$(".kiosk:checked").each(function () {
		allArray.push($(this).val());
		newallArray = allArray.join(',');
	});
};

// checkbox全選反選 
function setChecked(obj) {
	var kiosk = document.getElementsByName("kiosk");
	if (obj.id == "selectAll") {
		for (var i = 1; i < kiosk.length; i++) {
			if (obj.checked == true) {
				kiosk[i].checked = true;
			}
			else {
				kiosk[i].checked = false;
			}
		}
	}
	else {
		if (kiosk[0].checked = true) {
			kiosk[0].checked = false;
		}
	}
	count();
};

// 初始全選
function startValue() {
	$.ajax({
		url: "http://192.168.50.47:8002/api/KioskTable.aspx",
		method: "post", //直接傳遞物件
		dataType: 'json',
		data: {
			Token: getCookie('token'),
			type: TypeValue,
			Name: "",
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (data) {
			var html = "";
			var selectAll = "";
			document.getElementById('render').innerHTML = "";
			document.getElementById('selectall').innerHTML = "";
			document.getElementById('searchBtn').value = "";
			var kiosk = "'kiosk'";
			for (var i = 0; i < data.length; i++) {
				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="kiosk" type="checkbox" name="kiosk" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this,' + kiosk + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
			}
			var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="kiosk" id="selectAll" onclick="setChecked(this,' + kiosk + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
			document.getElementById('render').innerHTML = html;
			document.getElementById('selectall').innerHTML = selectAll;
			document.getElementById('searchBtn').value = "0";

			var Title = document.getElementById('title');
			if (TypeValue == "0") {
				Title.innerHTML = "通道刷卡機";
			}
			else if (TypeValue == "1") {
				Title.innerHTML = "崗哨";
			}
			$('input:checkbox[id=selectAll]').attr('checked', true);
			$('input:checkbox[class=kiosk]').attr('checked', true);
			count();
			KioskValue();
		},
		complete: function () {
			console.log(newallArray);
			$.ajax({
				url: "http://192.168.50.47:8002/api/FacePass.aspx",
				method: "post", //直接傳遞物件
				dataType: "json",
				data: {
					Token: getCookie('token'),
					InquireTime: "日",
					InquireType: "0",
					Name: newallArray,
					Export: "1",
				},
				beforeSend: function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (jsons) {
					console.log(jsons);
					var countSuccess = "";
					var countFail = "";
					var Series = [];
					var json = jsons.setXcontent; //X軸資料
					var jsona = jsons.Data; //數值
					var time = jsons.Time; //圖表日期範圍
					var Url = jsons.Url;//圖表匯出
					// var RateSuccess = jsona[1].setRate;
					var countSuccess = jsona[1].setData;
					// var RateFail = jsona[0].setRate;
					var countFail = jsona[0].setData;
					if (json.length > "15") {
						chart.updateOptions({
							xaxis: {
								categories: json,
							},
							chart: {
								width: 120 * json.length,
							},
						});
					}
					else {
						chart.updateOptions({
							xaxis: {
								categories: json,
							},
							chart: {
								width: '100%',
							},
						});
					}
					Series.push
						(
							{
								name: '通關失敗人數',
								data: countFail,
								type: 'bar',
							},
							{
								name: '通關成功人數',
								data: countSuccess,
								type: 'bar',
							}
						)
					chart.updateSeries(Series);
					document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
					document.getElementById("date").innerHTML = "日期：" + time;

				},
				complete: function () {
					$("#overlay").fadeOut(300);
				}

			})
		}

	});
};

function getValue() {
	$.ajax({
		url: "http://192.168.50.47:8002/api/KioskTable.aspx",
		method: "post", //直接傳遞物件
		data: {
			Token: getCookie('token'),
			type: TypeValue,
			Name: "",
		},
		dataType: 'json',
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (data) {
			var html = "";
			var selectAll = "";
			document.getElementById('submit').innerHTML = "確定";
			document.getElementById('render').innerHTML = "";
			document.getElementById('selectall').innerHTML = "";
			document.getElementById('searchBtn').value = "";
			var kiosk = "'kiosk'";
			for (var i = 0; i < data.length; i++) {
				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="kiosk" type="checkbox" name="kiosk" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this,' + kiosk + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
			}
			var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="kiosk" id="selectAll" onclick="setChecked(this,' + kiosk + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
			document.getElementById('render').innerHTML = html;
			document.getElementById('selectall').innerHTML = selectAll;
			document.getElementById('searchBtn').value = "0";

			var Title = document.getElementById('title');
			if (TypeValue == "0") {
				Title.innerHTML = "通道刷卡機";
			}
			else if (TypeValue == "1") {
				Title.innerHTML = "崗哨";
			}
		},
		complete: function () {
			$('input:checkbox[id=selectAll]').attr('checked', true);
			$('input:checkbox[class=kiosk]').attr('checked', true);
			count();
			KioskValue();
			ajax();
		}

	});

};

$("#searchBtn").click(function () {
	var searchText = $("#search").val(); //取得input值
	$.ajax({
		url: "http://192.168.50.47:8002/api/KioskTable.aspx",
		method: "post",
		dataType: 'json',
		data: {
			Token: getCookie('token'),
			type: TypeValue,
			Name: searchText,
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (data) {
			var html = "";
			var selectAll = "";
			document.getElementById('render').innerHTML = "";
			document.getElementById('selectall').innerHTML = "";
			document.getElementById('searchBtn').value = "";
			var kiosk = "'kiosk'";
			for (var i = 0; i < data.length; i++) {
				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="kiosk" type="checkbox" name="kiosk" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this,' + kiosk + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
			}
			var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="kiosk" id="selectAll" onclick="setChecked(this,' + kiosk + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
			document.getElementById('render').innerHTML = html;
			document.getElementById('selectall').innerHTML = selectAll;
			document.getElementById('searchBtn').value = "0";

			var Title = document.getElementById('title');
			if (TypeValue == "0") {
				Title.innerHTML = "通道刷卡機";
			}
			else if (TypeValue == "1") {
				Title.innerHTML = "崗哨";
			}
		},
		complete: function () {
			$("#overlay").fadeOut(300);
		}
	});
});


var chart;
$(document).ready(function () {
	var option = {
		chart: {
			height: 400,
			stacked: true,
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
			},
			zoom: {
				enabled: true
			}
		},
		colors: ["#E02020", "#8AC441"],
		dataLabels: {
			enabled: true,
		},
		stroke: {
			curve: 'smooth',
			width: 0
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
});

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
	console.log(newallArray);
	$.ajax({
		url: "http://192.168.50.47:8002/api/FacePass.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			Token: getCookie('token'),
			InquireTime: Range,
			InquireType: TypeValue,
			Name: newallArray,
			Export: "1",
		},
		beforeSend: function () {
			$("#overlay").fadeIn(1000);
		},
		success: function (jsons) {
			console.log(jsons);
			var countSuccess = "";
			var countFail = "";
			var Series = [];
			var json = jsons.setXcontent; //X軸資料
			var jsona = jsons.Data; //數值
			var time = jsons.Time; //圖表日期範圍
			var Url = jsons.Url;//圖表匯出
			// var RateSuccess = jsona[1].setRate;
			var countSuccess = jsona[1].setData;
			// var RateFail = jsona[0].setRate;
			var countFail = jsona[0].setData;
			if (json.length > "15") {
				chart.updateOptions({
					xaxis: {
						categories: json,
					},
					chart: {
						width: 120 * json.length,
					},
				});
			}
			else {
				chart.updateOptions({
					xaxis: {
						categories: json,
					},
					chart: {
						width: '100%',
					},
				});
			}
			Series.push
				(
					{
						name: '通關失敗人數',
						data: countFail,
						type: 'bar',
					},
					{
						name: '通關成功人數',
						data: countSuccess,
						type: 'bar',
					}
				)
			chart.updateSeries(Series);
			document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
			document.getElementById("date").innerHTML = "日期：" + time;

		},
		complete: function () {
			$("#overlay").fadeOut(300);
		}

	})

}