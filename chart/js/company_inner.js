$(document).ready(function () {
	CookieExist('token', 'company_inner');
	$('#chartbox').css = ('width', 'calc(' + $(window).width() + '-10px)');
	$('input:radio[name=inquiretype][id=twenty]').attr('checked', true);
	$('input:radio[name=sort][id=Factory]').attr('checked', true);
	getData();
	TypeValue = "0"
	SortValue = "0"
	appchart.message = "日"
});

function getData() {
	$.ajax({
		url: "http://192.168.50.47:8002/api/CompanyChart.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			InquireTime: "日",
			Type: "0",
			Company: "",
			Sort: "0",
			Export: "1",
			Token: getCookie('token'),
		},
		beforeSend: function () {
			$("#overlay").fadeIn();
		},
		success: function (evt) {
			console.log(evt);
			if (evt.setXcontent == null) {
				$("#overlay").fadeOut();
			}
			else {
				var workPeople = "";
				var Contract = "";
				var People = "";
				var InPeople = "";
				var Series = [];
				var labelX = evt.setXcontent; //X軸資料
				var chartData = evt.setData; //數值
				var time = evt.Time; //圖表日期範圍
				var Url = evt.Url;//圖表匯出
				for (var i = 0; i < chartData.length; i++) {
					if (chartData[i].setName == "點工上工人數") {
						workPeople = chartData[i].setData;
					}
					else if (chartData[i].setName == "發包數量") {
						Contract = chartData[i].setData;
					}
					else if (chartData[i].setName == "廠內無效人力人數") {
						People = chartData[i].setData;
					}
					else if (chartData[i].setName == "機組區無效人力人數") {
						InPeople = chartData[i].setData;
					}
				}
				var workPeople = chartData[0].setData;
				var Contract = chartData[1].setData;
				var People = chartData[2].setData;
				var InPeople = chartData[3].setData;
				if (labelX.length > "15") {
					chart.updateOptions({
						xaxis: {
							categories: labelX,
						},
						chart: {
							width: 200 * labelX.length,
						},
					});
				}
				else {
					chart.updateOptions({
						xaxis: {
							categories: labelX,
						},
						chart: {
							width: '100%',
						},
					});
				}
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

				chart.updateOptions({
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
						events: { // 添加柱状图数据的点击事件
							click: function (event, chartContext, config) {
								if(event.srcElement.instance._stroke=="#00AFD0"){
									var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
									if (config.dataPointIndex != "-1") {
										window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "0" + "&" + "1" + "&" + seriesTime + "&";
									}
								}
								else if(event.srcElement.instance._stroke=="#007F97"){
									var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
									if (config.dataPointIndex != "-1") {
										window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "1" + "&" + "1" + "&" + seriesTime + "&";
									}
								}
							}
						}
					}

				});
				document.getElementById("date").innerHTML = "日期：" + time;
				document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
			}
		},
		complete: function () {
			$("#overlay").fadeOut();
		}
	});

}

// 公司資料
// function getCompany() {
// 	var searchText = "";
// 	$.ajax({
// 		url: "http://192.168.50.47:8002/api/CompanyTable.aspx",
// 		method: "post",
// 		dataType: 'json',
// 		data: {
// 			Token: getCookie('token'),
// 			Name: searchText,
// 			Type: "1",
// 		},
// 		success: function (data) {
// 			var html = "";
// 			//清空確定
// 			document.getElementById('company').innerHTML = "";
// 			for (var i = 0; i < data.length; i++) {
// 				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="company" type="checkbox" name="company" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this)"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
// 			}
// 			document.getElementById('company').innerHTML = html;
// 			$('input:checkbox[id=selectAll]').attr('checked', true);
// 			$('input:checkbox[class=company]').attr('checked', true);
// 		},
// 		complete: function () {
// 			count();
// 			getCompanyValue()
// 			$("#overlay").fadeOut();
// 		}
// 	});
// };

//查詢按鈕
$("#searchBtn").click(function () {
	var searchText = $("#search").val(); //取得input值
	document.getElementById('submit').innerHTML = "確定";
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
			$("#overlay").fadeIn();
		},
		success: function (data) {
			var html = "";
			//清空確定
			document.getElementById('company').innerHTML = "";
			for (var i = 0; i < data.length; i++) {
				html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="company" type="checkbox" name="company" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this)"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
			}
			document.getElementById('company').innerHTML = html;
			$('input:checkbox[id=selectAll]').attr('checked', false);
		},
		complete: function () {
			$("#overlay").fadeOut();
		}
	});
});
var CompanyArray = [];
var newCompanyArray = "";
var TypeValue = "";
var SortValue = "";

// radio type change
function typechange(type) {
	$("#overlay").fadeIn();
	$(".companybox").css("display", "block");
	if (type.value == 0) {
		$(".companybox").css("display", "none");
		TypeValue = "0";
		ajax();
	} else {
		$(".companybox").css("display", "block");
		var searchText = "";
		$.ajax({
			url: "http://192.168.50.47:8002/api/CompanyTable.aspx",
			method: "post",
			dataType: 'json',
			data: {
				Token: getCookie('token'),
				Name: searchText,
				Type: "1",
			},
			success: function (data) {
				var html = "";
				//清空確定
				document.getElementById('company').innerHTML = "";
				for (var i = 0; i < data.length; i++) {
					html += '<div class="checkwrapper"><div class="square"><div class="checkfield"><input class="company" type="checkbox" name="company" id="' + data[i].Name + '" value="' + data[i].Name + '" onclick="setChecked(this)"><label for="' + data[i].Name + '"></label><span>' + data[i].Name + '</span></div></div></div>';
				}
				document.getElementById('company').innerHTML = html;
				$('input:checkbox[id=selectAll]').attr('checked', true);
				$('input:checkbox[class=company]').attr('checked', true);
			},
			complete: function () {
				count();
				getCompanyValue();
			}
		});
		TypeValue = "1";
	}
}

// radio value sort陣列
function getSortValue() {
	SortValue = $("input:radio[name=sort]:checked").val();
	ajax();
};

// 計算數量
function count() {
	var numberOfChecked = $('.company:checked').length;
	document.getElementById('submit').innerHTML = "確定(" + numberOfChecked + ")";
};

// checkbox value陣列
function getCompanyValue() {
	CompanyArray = [];
	newCompanyArray = "";
	$(".company:checked").each(function () {
		CompanyArray.push($(this).val());
		newCompanyArray = CompanyArray.join(',') + ",";
	});
	ajax();
};

// checkbox全選反選 
function setChecked(obj) {
	var company = document.getElementsByName("company");
	if (obj.id == "selectAll") {
		for (var i = 1; i < company.length; i++) {
			if (obj.checked == true) {
				company[i].checked = true;
			}
			else {
				company[i].checked = false;
			}
		}
	}
	else {
		if (company[0].checked = true) {
			company[0].checked = false;
		}
	}
	count();
};


// 設定圖表render
var chart;
$(document).ready(function () {
	var option = {
		chart: {
			height: 400,
			toolbar: {
				show: false,
			}
		},
		colors: ["#A8D9E2", "#00AFD0", "#007F97", "#005B6B"],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [0, 0, 0, 5],
		},
		grid: {
			borderColor: '#e7e7e7',
		},
		markers: {
			size: 6
		},
		series: [
		],
		fill: {
			opacity: [1, 1, 1, 1],
		},
		labels: [
			//日期陣列
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
			$("#overlay").fadeIn();
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
	// console.log(newCompanyArray);
	// console.log(SortValue);
	$.ajax({
		url: "http://192.168.50.47:8002/api/CompanyChart.aspx",
		method: "post", //直接傳遞物件
		dataType: "json",
		data: {
			InquireTime: Range,
			Type: TypeValue,
			Company: newCompanyArray,
			Sort: SortValue,
			Export: "1",
			Token: getCookie('token'),
		},
		beforeSend: function () {
			$("#overlay").fadeIn();
		},
		success: function (evt) {
			console.log(evt);
			if (TypeValue == "0" && evt.setXcontent == null) {
				$("#overlay").fadeOut();
			}
			else {
				var workPeople = "";
				var Contract = "";
				var People = "";
				var InPeople = "";
				var Series = [];
				var labelX = evt.setXcontent; //X軸資料
				var chartData = evt.setData; //數值
				var time = evt.Time; //圖表日期範圍
				var Url = evt.Url;//圖表匯出
				for (var i = 0; i < chartData.length; i++) {
					if (chartData[i].setName == "點工上工人數") {
						workPeople = chartData[i].setData;
					}
					else if (chartData[i].setName == "發包數量") {
						Contract = chartData[i].setData;
					}
					else if (chartData[i].setName == "廠內無效人力人數") {
						People = chartData[i].setData;
					}
					else if (chartData[i].setName == "機組區無效人力人數") {
						InPeople = chartData[i].setData;
					}
				}
				if (labelX.length > "15") {
					chart.updateOptions({
						xaxis: {
							categories: labelX,
						},
						chart: {
							width: 200 * labelX.length,
						},
					});
				}
				else {
					chart.updateOptions({
						xaxis: {
							categories: labelX,
						},
						chart: {
							width: '100%',
						},
					});
				}

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
				chart.updateOptions({
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
						events: { // 添加柱状图数据的点击事件
							click: function (event, chartContext, config) {
								if(event.srcElement.instance._stroke=="#00AFD0"){
									var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
									if (config.dataPointIndex != "-1") {
										window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "0" + "&" + "1" + "&" + seriesTime + "&";
									}
								}
								else if(event.srcElement.instance._stroke=="#007F97"){
									var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
									if (config.dataPointIndex != "-1") {
										window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + "日" + "&" + "1" + "&" + "1" + "&" + seriesTime + "&";
									}
								}
							}
						}
					}

				});
				document.getElementById("date").innerHTML = "日期：" + time;
				document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;

			}

		},
		complete: function () {
			$("#overlay").fadeOut();
		}

	});
}