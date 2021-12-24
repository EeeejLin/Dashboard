// 設定圖表render
function typechange(type) {
	$(".SortA").css("display", "none");
	$(".SortC").css("display", "none");
	if (type.value == 0) {
		$(".SortA").css("display", "flex");
		$(".SortC").css("display", "none");
		document.getElementById('getInner').style['display'] = 'none';
		$('input:radio[name=sortA][id=companysortA]').prop('checked' , false);
		$('input:radio[name=sortA][id=officesortA]').prop('checked', true);
		TypeValue = "0";
		getOffice();
	} else {
		$(".SortA").css("display", "none");
		$(".SortC").css("display", "flex");
		$('input:radio[name=sortC][id=companysortC]').prop('checked' , false);
		$('input:radio[name=sortC][id=areasortC]').prop('checked' , false);
		$('input:radio[name=sortC][id=officesortC]').prop('checked', true);
		TypeValue = "1";
		getOffice();
	}
	//Radio change 收合開啟
	$('input[type="radio"][name="inquiretype"]').on('click change', function (e) {
		// console.log(e.type);
		$('#title').addClass('active_accordion');
		$('.confirm,.search,#renderout').css('display', 'inline-block');
	});
}
// 預設資料
$(document).ready(function () {
	CookieExist('token', 'overtime');
	document.getElementById('chartbox').style.width = 'calc(' + $(window).width() + '-10px)';
	var url = location.href;
	appchart.message = "0";
	if (url.indexOf('?') != -1) {
		//在此直接將各自的參數資料切割放進ary中
		var ary = url.split('?')[1].split('&');
		var time = ary[0].split('=');
		TypeValue = time[1];
		SortValue = ary[1];
		InnerAll = ary[2];
		Choice = "1";
		newRange = "";
		if (TypeValue == "0") {
			$('input:radio[name=inquiretype][id=typeFFCP]').attr('checked', true);
			$(".SortA").css("display", "flex");
			if (SortValue == "0") {
				$('input:radio[name=sortA][id=officesortA]').attr('checked', true);
				document.getElementById('getInner').style['display'] = 'none';
				getOffice();
			}
		}
		else if (TypeValue == "1") {
			$('input:radio[name=inquiretype][id=typeCP]').attr('checked', true);
			$(".SortC").css("display", "flex");
			if (SortValue == "0") {
				$('input:radio[name=sortC][id=officesortC]').attr('checked', true);
				document.getElementById('getInner').style['display'] = 'none';
				getOffice();
			}
			else if (SortValue == "1") {
				if (InnerAll == "1") {
					$('input:radio[name=sortB][id=factoryOut]').attr('checked', true);
				}
				else if (InnerAll == "2") {
					$('input:radio[name=sortB][id=factoryIn]').attr('checked', true);
				}
				$('input:radio[name=sortC][id=areasortC]').attr('checked', true);
				document.getElementById('getInner').style['display'] = 'flex';
				getArea();
			}
		}
	}
});
// 組室資料
function getOffice() {
	SortValue="0";
	$("#overlay").fadeIn();
	var searchText = "";
	document.getElementById('getInner').style['display'] = 'none';
	$.ajax({
		url: "http://192.168.50.47:8002/api/WorkOfficeTable.aspx",
		dataType: 'json',
		method: "post",
		data: {
			Token: getCookie('token'),
			Name: searchText,
		},
		// beforeSend: function () {
		// 	$("#overlay").fadeIn(1000);
		// },
		success: function (data) {
			var html = "";
			var selectAll = "";
			document.getElementById('submit').innerHTML = "確定";
			document.getElementById('render').innerHTML = "";
			document.getElementById('selectall').innerHTML = "";
			document.getElementById('searchBtn').value = "";
			var office = "'office'";
			for (var i = 0; i < data.length; i++) {
				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="office" type="checkbox" name="office" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this,' + office + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
			}
			var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="office" id="selectAll" onclick="setChecked(this,' + office + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
			document.getElementById('render').innerHTML = html;
			document.getElementById('selectall').innerHTML = selectAll;
			document.getElementById('searchBtn').value = "0";
			document.getElementById('title').innerHTML = "組室";
			$('input:checkbox[id=selectAll]').attr('checked', true);
			$('input:checkbox[class=office]').attr('checked', true);
		},
		complete: function () {
			count('office');
			getValue();
			// $("#overlay").fadeOut();
		}
	});
};
// 區域資料
function getArea() {
	SortValue="1";
	$("#overlay").fadeIn();
	var searchText = "";
	document.getElementById('getInner').style['display'] = 'flex';
	$('input:radio[name=sortB][id=factoryOut]').prop('checked', false);
	$('input:radio[name=sortB][id=factory]').prop('checked', false);
	$('input:radio[name=sortB][id=factoryall]').prop('checked', true);
	$.ajax({
		url: "http://192.168.50.47:8002/api/WorkPlaceTable.aspx",
		dataType: 'json',
		method: "post",
		data: {
			Token: getCookie('token'),
			Name: searchText,
		},
		// beforeSend: function () {
		// 	$("#overlay").fadeIn(1000);
		// },
		success: function (data) {
			var html = "";
			var selectAll = "";
			//清空確定
			document.getElementById('submit').innerHTML = "確定";
			document.getElementById('render').innerHTML = "";
			document.getElementById('selectall').innerHTML = "";
			document.getElementById('searchBtn').value = "";
			var area = "'area'";
			for (var i = 0; i < data.length; i++) {
				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="area" type="checkbox" name="area" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this,' + area + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
			}
			var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="area" id="selectAll" onclick="setChecked(this,' + area + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
			document.getElementById('render').innerHTML = html;
			document.getElementById('selectall').innerHTML = selectAll;
			document.getElementById('searchBtn').value = "1";
			document.getElementById('title').innerHTML = "區域";
			$('input:checkbox[id=selectAll]').attr('checked', true);
			$('input:checkbox[class=area]').attr('checked', true);
		},
		complete: function () {
			count('area');
			getValue();
			// $("#overlay").fadeOut();
		}
	});
};

// 公司資料
function getCompany() {
	SortValue="2";
	$("#overlay").fadeIn();
	var searchText = "";
	document.getElementById('getInner').style['display'] = 'none';
	$.ajax({
		url: "http://192.168.50.47:8002/api/CompanyTable.aspx",
		method: "post",
		dataType: 'json',
		data: {
			Token: getCookie('token'),
			Name: searchText,
			Type: "1",
		},
		// beforeSend: function () {
		// 	$("#overlay").fadeIn(1000);
		// },
		success: function (data) {
			console.log(data);
			var html = "";
			var selectAll = "";
			//清空確定
			document.getElementById('submit').innerHTML = "確定";
			document.getElementById('render').innerHTML = "";
			document.getElementById('selectall').innerHTML = "";
			document.getElementById('searchBtn').value = "";
			var company = "'company'";
			for (var i = 0; i < data.length; i++) {
				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="company" type="checkbox" name="company" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this,' + company + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
			}
			var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="company" id="selectAll" onclick="setChecked(this,' + company + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
			document.getElementById('render').innerHTML = html;
			document.getElementById('selectall').innerHTML = selectAll;
			document.getElementById('searchBtn').value = "2";
			document.getElementById('title').innerHTML = "公司";
			$('input:checkbox[id=selectAll]').attr('checked', true);
			$('input:checkbox[class=company]').attr('checked', true);
		},
		complete: function () {
			count('company');
			getValue();
			// $("#overlay").fadeOut();
		}
	});
};

//查詢按鈕
$("#searchBtn").click(function () {
	var search = $("#searchBtn").val();
	var searchText = $("#search").val(); //取得input值
	// 組室資料
	if (search == "0") {
		$.ajax({
			url: "http://192.168.50.47:8002/api/WorkOfficeTable.aspx",
			dataType: 'json',
			method: "post",
			data: {
				Token: getCookie('token'),
				Name: searchText,
			},
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
				var office = "'office'";
				for (var i = 0; i < data.length; i++) {
					html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="office" type="checkbox" name="office" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this,' + office + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
				}
				var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="office" id="selectAll" onclick="setChecked(this,' + office + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
				document.getElementById('render').innerHTML = html;
				document.getElementById('selectall').innerHTML = selectAll;
				document.getElementById('searchBtn').value = "0";
				document.getElementById('title').innerHTML = "組室";
			},
			complete: function () {
				$("#overlay").fadeOut();
			}
		});
	}
	// 區域資料
	else if (search == "1") {
		$.ajax({
			url: "http://192.168.50.47:8002/api/WorkPlaceTable.aspx",
			dataType: 'json',
			method: "post",
			data: {
				Token: getCookie('token'),
				Name: searchText,
			},
			beforeSend: function () {
				$("#overlay").fadeIn(1000);
			},
			success: function (data) {
				var html = "";
				var selectAll = "";
				//清空確定
				document.getElementById('submit').innerHTML = "確定";
				document.getElementById('render').innerHTML = "";
				document.getElementById('selectall').innerHTML = "";
				document.getElementById('searchBtn').value = "";
				var area = "'area'";
				for (var i = 0; i < data.length; i++) {
					html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="area" type="checkbox" name="area" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this,' + area + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
				}
				var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="area" id="selectAll" onclick="setChecked(this,' + area + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
				document.getElementById('render').innerHTML = html;
				document.getElementById('selectall').innerHTML = selectAll;
				document.getElementById('searchBtn').value = "1";
				document.getElementById('title').innerHTML = "區域";
			},
			complete: function () {
				$("#overlay").fadeOut();
			}
		});
	}
	// 公司資料
	else if (search == "2") {
		$.ajax({
			url: "http://192.168.50.47:8002/api/CompanyTable.aspx",
			method: "post",
			dataType: 'json',
			data: {
				Token: getCookie('token'),
				Name: searchText,
				Type: "1",
			},
			beforeSend: function () {
				$("#overlay").fadeIn(1000);
			},
			success: function (data) {
				var html = "";
				var selectAll = "";
				//清空確定
				document.getElementById('submit').innerHTML = "確定";
				document.getElementById('render').innerHTML = "";
				document.getElementById('selectall').innerHTML = "";
				document.getElementById('searchBtn').value = "";
				var company = "'company'";
				for (var i = 0; i < data.length; i++) {
					html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="company" type="checkbox" name="company" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this,' + company + ')"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
				}
				var selectAll = '<div class="checkwrapper"><div class="square"><div class="checkfield"><input type="checkbox" name="company" id="selectAll" onclick="setChecked(this,' + company + ')"><label for="selectAll"></label><span>全選</span></div></div></div>';
				document.getElementById('render').innerHTML = html;
				document.getElementById('selectall').innerHTML = selectAll;
				document.getElementById('searchBtn').value = "2";
				document.getElementById('title').innerHTML = "公司";
			},
			complete: function () {
				$("#overlay").fadeOut();
			}
		});
	}
});

var arrayname = "";
var allArray = [];
var newallArray = "";
var TypeValue = "";
var SortValue = "";
var InnerValue = "";

// 計算數量
function count(name) {
	console.log("count");
	var numberOfChecked = $('.' + name + ':checked').length;
	document.getElementById('submit').innerHTML = "確定(" + numberOfChecked + ")";
}
// checkbox value陣列
function getValue() {
	console.log("getValue");
	arrayname = "";
	allArray = [];
	newallArray = "";
	arrayname = document.getElementById('selectAll').name;
	$("." + arrayname + ":checked").each(function () {
		allArray.push($(this).val());
	});
	newallArray = allArray.join(',') ;
	ajax();

}

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
			curve: 'smooth'
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
		message: '週',
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
	$("#overlay").fadeIn();
	var Range = "";
	var Choice = appchart.message;
	if (appchart.message == "3") {
		Range = appchart.range[0] + "-" + appchart.range[1];
	}
	else {
		Range = "";
	}

	console.log(TypeValue);
	console.log(SortValue);
	console.log(newallArray);
	console.log(Choice);
	console.log(Range);

	$.ajax({
		url: "http://192.168.50.47:8002/api/OverTimeChart.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			Token: getCookie('token'),
			Type: TypeValue,
			Status: SortValue,
			Result: newallArray,
			DateChioce: Choice,
			DateRange: Range,
			Down: "1",
		},
		// beforeSend: function () {
		// 	$("#overlay").fadeIn(1000);
		// },
		success: function (evt) {
			console.log(evt);
			if (evt.setXcontent == null) {
				$("#overlay").fadeOut();
			}
			var Item = function () {
				return {
					name: '',
					type: 'bar',
					data: [],
				}
			};
			var Series = [];
			var json = evt.setXcontent; //X軸資料
			var jsona = evt.setData; //數值
			var time = evt.Time; //圖表日期範圍
			var Url = evt.Url;//圖表匯出
			var it = new Item();
			it.data = jsona[0].setData;
			it.name = jsona[0].setName;
			Series.push(it);
			// var Url = evt[0].Url;
			// 圖表各別名稱
			console.log(json.length);
			var barname = "";
			if (TypeValue == "0") {
				barname = "加班人數";
			}
			else if (TypeValue == "1") {
				barname = "未申請加班人數";
			}
			if (json.length >= "15") {
				chart.updateOptions({
					xaxis: {
						categories: json,
					},
					chart: {
						width: 200 * json.length,
					}
				});
			}
			else {
				chart.updateOptions({
					xaxis: {
						categories: json,
					},
					chart: {
						width: '100%',
					}
				});
			}
			chart.updateSeries(Series);

			var title1 = "";
			if (TypeValue == "0") {
				title1 = "加班";
				chart.updateOptions({
					chart: {
						events: { // 添加柱状图数据的点击事件
							click: function (event, chartContext, config) {
								var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
								if (config.dataPointIndex != "-1") {
									window.location.href = "http://192.168.50.47:8002/chart/peopletable.html?type=" + time + "&" + "0" + "&" + seriesTime + "&" + SortValue + "&";
								}
							}
						}
					}

				});
			}
			else if (TypeValue == "1") {
				title1 = "未申請加班";
				chart.updateOptions({
					chart: {
						events: { // 添加柱状图数据的点击事件
							click: function (event, chartContext, config) {
								var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
								if (config.dataPointIndex != "-1") {
									window.location.href = "http://192.168.50.47:8002/chart/peopletable.html?type=" + time + "&" + "1" + "&" + seriesTime + "&" + SortValue + "&";
								}
							}
						}
					}
				});
			}
			var title2 = "";
			if (SortValue == "0") {
				title2 = "(組室/人數)";
			}
			else if (SortValue == "1") {
				title2 = "(區域/人數)";
			}
			else if (SortValue == "2") {
				title2 = "(公司/人數)";
			}
			document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
			document.getElementById("title_chart").innerHTML = title1 + title2 + "統計圖";
			document.getElementById("date").innerHTML = "日期：" + time;

			chart.updateSeries(Series);

		},
		complete: function () {
			$("#overlay").fadeOut();
		}

	})
}
