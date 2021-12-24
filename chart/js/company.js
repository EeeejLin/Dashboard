$(document).ready(function () {
	setTimeout(forapi.mainpage, 1000);
	CookieExist('token', 'company');
	$('#chartbox').css = ('width', 'calc(' + $(window).width() + '-10px)');
})
var forapi = new Vue({
	el: '#forapi',
	data: {
		//將ajax寫在這裡面
		companyToday: '',
		peopleWork: '',
		peopleInWork: '',
		contractOutToday: '',
		peopleUnWork: '',
		peopleInUnWork: '',
	},
	methods: { //methods是關鍵字 
		mainpage: function () {
			let vm = this;
			$.ajax({
				url: "http://192.168.50.47:8002/api/OrderQuantity.aspx",
				method: "post", //直接傳遞物件
				dataType: 'json',
				data: {
					Token: getCookie('token'),
				},
				beforeSend: function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (evt) {
					console.log(evt)
					vm.message = "";
					forapi.companyToday = evt.FactoryQuantity;
					forapi.peopleWork = evt.FactoryWorkQuantity;
					forapi.peopleInWork = evt.CrewWorkQuantity;
					forapi.contractOutToday = evt.ProjectQuantity;
					forapi.peopleUnWork = evt.FactoryExcessQuantity;
					forapi.peopleInUnWork = evt.CrewExcessQuantity;
				},
				complete: function () {
					setTimeout(forapi.mainpage, 600000);
					var today = new Date();
					var y = today.getFullYear();//年份
					$.ajax({
						url: "http://192.168.50.47:8002/api/OrderChart.aspx",
						method: "post", //直接傳遞物件
						dataType: "json",
						data: {
							InquireTime: "週",
							InquireType: "Factory",
							Export: "1",
							Token: getCookie('token'),
						},
						beforeSend: function () {
							$("#overlay").fadeIn(1000);
						},
						success: function (jsons) {
							var Item = function () {
								return {
									name: '',
									type: 'bar',
									data: [],
								}
							};
							var Series = [];
							var json = jsons.setXcontent; //X軸資料
							var jsona = jsons.setData; //數值
							var time = jsons.Time; //圖表日期範圍
							var Url = jsons.Url; //圖表匯出
							var it = new Item();
							it.data = jsona[0].setData;
							it.name = jsona[0].setName;
							Series.push(it);
							chart.updateOptions({
								xaxis: {
									categories: json
								},
							});
							chart.updateSeries(Series);
							appchart.datechoose = time;
							document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
						},
						complete: function () {
							$("#overlay").fadeOut(300);
						}

					})
					//不足兩位數補零
					var mo = (today.getMonth() + 1 < 10 ? '0' : '') + (today.getMonth() + 1);//月份
					var d = (today.getDate() < 10 ? '0' : '') + today.getDate();//日期
					var h = (today.getHours() < 10 ? '0' : '') + today.getHours();//小時
					var m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();//分鐘
					var s = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();//秒
					var currentDateTime = y + '/' + mo + '/' + d + '/ ' + h + ':' + m + ':' + s;
					document.getElementById('refreshtime').innerHTML = '更新時間：' + currentDateTime;
				}
			});
		}
	}
});

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
		colors: ['#00AFD0'],
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
			show: true,
			fontSize: '14px',
			fontFamily: 'Helvetica, Arial',
			fontWeight: 400,
			showForSingleSeries: true, //即使只有一種類別也要顯示legend
			itemMargin: {
				vertical: 10
			},
		},

	};
	chart = new ApexCharts(document.querySelector("#main"), option);
	chart.render();
});

Vue.component("todo", {
	template: `<div class="radio mg-10"><input type="radio" :id="name"  @change="toggle" :checked="checkedTodo()"><label :for="name">{{text}}</label></div>`,
	props: ["text", "name", "select"],
	data() {
		return {
			isDone: this.name,
			selectValue: this.select,
		};
	},
	methods: {
		toggle(e) {
			this.$emit('event', this.name, this.text)
		},
		checkedTodo() {
			return this.name === this.select
		}
	}
});

let appchart = new Vue({
	el: '#chart_app',
	data: {
		todos: [
			{ text: '承攬公司數量', name: 'Factory' },
			{ text: '發包數量', name: 'Project' },
			{ text: '廠內點工上工人數', name: 'FactoryOrder' },
			{ text: '廠內無效人力人數', name: 'FactoryExcess' },
			{ text: '機組區點工上工人數', name: 'CrewOrder' },
			{ text: '機組區無效人力人數', name: 'CrewExcess' }
		],
		select: 'Factory',
		text: '承攬公司數量',
		datechoose: '',
		message: '週',
		range: '',

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
			if (appchart.message == "自訂") {
				Range = appchart.range[0] + "-" + appchart.range[1];
			}
			else {
				Range = appchart.message;
			}
			$.ajax({
				url: "http://192.168.50.47:8002/api/OrderChart.aspx",
				method: "post", //直接傳遞物件
				dataType: "json",
				data: {
					InquireTime: Range,
					InquireType: appchart.select,
					Export: "1", //parseerror
					Token: getCookie('token'),
				},
				beforeSend: function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (jsons) {
					console.log(jsons);
					var Item = function () {
						return {
							name: '',
							type: 'bar',
							data: [],
						}
					};
					var Series = [];
					var json = jsons.setXcontent; //X軸資料
					var jsona = jsons.setData; //數值
					var time = jsons.Time; //圖表日期範圍
					var Url = jsons.Url;//圖表匯出
					var it = new Item();
					it.data = jsona[0].setData;
					it.name = jsona[0].setName;
					Series.push(it);
					console.log(json.length);
					if (json.length > "15") {
						chart.updateOptions({
							xaxis: {
								categories: json,
							},
							chart: {
								width: 120 * json.length,
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

					if (appchart.select == "FactoryExcess") {
						chart.updateOptions({
							chart: {
								events: { // 添加柱状图数据的点击事件
									click: function (event, chartContext, config) {
										var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
										if (config.dataPointIndex != "-1") {
											console.log(seriesTime);
											window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + seriesTime + "&" + "0" + "&" + "2" + "&";
										}
									}
								}
							}

						});
					}
					else if (appchart.select == "CrewExcess") {
						chart.updateOptions({
							chart: {
								events: { // 添加柱状图数据的点击事件
									click: function (event, chartContext, config) {
										var seriesTime = config.globals.categoryLabels[config.dataPointIndex];
										if (config.dataPointIndex != "-1") {
											console.log(seriesTime);
											window.location.href = "http://192.168.50.47:8002/chart/companytable.html?type=" + seriesTime + "&" + "1" + "&" + "2" + "&";
										}
									}
								}
							}
						});
					}

					chart.updateSeries(Series);
					appchart.datechoose = time;
					document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;

				},
				complete: function () {
					$("#overlay").fadeOut(300);
				}

			})


		}
	}
})

