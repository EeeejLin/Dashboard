let people = new Vue({
	el: "#people",
	data: {
		peopleMonth: '',
		peopleOvertime: '',
		peopleDay: '',
		peopleInDay: '',
		peopleUnOvertime_chart: '',
		peopleCurrent_chart: '',
		peopleInUnOvertime_chart: '',
		peopleInCurrent_chart: '',
	},
	methods: { //methods是關鍵字 
		mainpage: function () {
			let vm = this;
			var peopleUnOvertime_chart = "";
			var peopleCurrent_chart = "";
			var peopleInUnOvertime_chart = "";
			var peopleInCurrent_chart = "";
			$.ajax({
				url: "http://192.168.50.47:8002/api/PeopleStatus.aspx",
				method: "post", //直接傳遞物件
				data: {
					Token: getCookie('token'),
				},
				beforeSend: function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (evt) {
					console.log(evt);
					vm.message = "";
					var peopleSubstitute = ""
					var peopleBlacklist = ""
					var peopleIn = ""
					var peopleOut = ""
					var peopleNoCard = ""
					var peopleNoFace = ""
					var peopleUntrain = ""
					var peopleWalkWrong = ""
					var peopleUnOvertime = ""
					var peopleOutTime = ""
					var peopleUnavailableCard = ""
					var peopleCardOutTime = ""
					var lockCard = ""
					var unlockCard = ""
					var cardnotOpen = ""
					var peopleInFactory = ""
					var peopleOutFactory = ""

					$.each(JSON.parse(evt), function (k, item) {
						switch (item.Text) {
							case "peopleMonth":
								people.peopleMonth = item.Count;
								break;
							case "peopleOvertime":
								people.peopleOvertime = item.Count;
								break;
							case "peopleDay":
								people.peopleDay = item.Count;
								break;
							case "peopleInDay":
								people.peopleInDay = item.Count;
								break;
							case "peopleUnOvertime_chart":
								peopleUnOvertime_chart = item.Count;
								people.peopleUnOvertime_chart = item.Count;
								break;
							case "peopleCurrent_chart":
								peopleCurrent_chart = item.Count;
								people.peopleCurrent_chart = item.Count;
								break;
							case "peopleInUnOvertime_chart":
								peopleInUnOvertime_chart = item.Count;
								people.peopleInUnOvertime_chart = item.Count;
								break;
							case "peopleInCurrent_chart":
								peopleInCurrent_chart = item.Count;
								people.peopleInCurrent_chart = item.Count;
								break;
							case "peopleSubstitute":
								peopleSubstitute = item.Count;
								break;
							case "peopleBlacklist":
								peopleBlacklist = item.Count;
								break;
							case "peopleNoCard":
								peopleNoCard = item.Count;
								break;
							case "peopleNoFace":
								peopleNoFace = item.Count;
								break;
							case "peopleWalkWrong":
								peopleWalkWrong = item.Count;
								break;
							case "peopleUntrain":
								peopleUntrain = item.Count;
								break;
							case "peopleCardOutTime":
								peopleCardOutTime = item.Count;
								break;
							case "peopleUnavailableCard":
								peopleUnavailableCard = item.Count;
								break;
							case "peopleUnOvertime":
								peopleUnOvertime = item.Count;
								break;
							case "peopleOutTime":
								peopleOutTime = item.Count;
								break;
							case "peopleIn":
								peopleIn = item.Count;
								break;
							case "peopleOut":
								peopleOut = item.Count;
								break;
							case "lockCard":
								lockCard = item.Count;
								break;
							case "unlockCard":
								unlockCard = item.Count;
								break;
							case "cardnotOpen":
								cardnotOpen = item.Count;
								break;
							case "peopleInFactory":
								peopleInFactory = item.Count;
								break;
							case "peopleOutFactory":
								peopleOutFactory = item.Count;
								break;
						}
					})
					var html1 = "";
					var html2 = "";
					var html3 = "";
					var html4 = "";
					var html5 = "";
					var html6 = "";
					var html7 = "";
					var html8 = "";
					var html9 = "";
					var html10 = "";
					var html11 = "";
					var html12 = "";
					var html13 = "";
					var html14 = "";
					var html15 = "";
					var html16 = "";
					var html17 = "";
					if (peopleNoCard != "") {
						html1 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="1"><p class="bl_word fs-16 fw-900 grow-1">無此卡資料</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleMonth + '</p></button>';
					}
					if (peopleNoFace != "") {
						html2 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="2"><p class="bl_word fs-16 fw-900 grow-1">無人臉資料</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleNoFace + '</p></button>';
					}
					if (peopleSubstitute != "") {
						html3 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="3"><p class="bl_word fs-16 fw-900 grow-1">代刷</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleSubstitute + '</p></button>';
					}
					if (peopleBlacklist != "") {
						html4 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="4"><p class="bl_word fs-16 fw-900 grow-1">黑名單</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleBlacklist + '</p></button>';
					}
					if (peopleWalkWrong != "") {
						html5 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="5"><p class="bl_word fs-16 fw-900 grow-1">走錯刷卡點</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleWalkWrong + '</p></button>';
					}
					if (peopleUntrain != "") {
						html6 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="6"><p class="bl_word fs-16 fw-900 grow-1">未受公安訓練</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleUntrain + '</p></button>';
					}
					if (peopleCardOutTime != "") {
						html7 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="7"><p class="bl_word fs-16 fw-900 grow-1">工作證逾時</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleCardOutTime + '</p></button>';
					}
					if (peopleUnavailableCard != "") {
						html8 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="8"><p class="bl_word fs-16 fw-900 grow-1">工作證無效</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleUnavailableCard + '</p></button>';
					}
					if (peopleUnOvertime != "") {
						html9 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="9"><p class="bl_word fs-16 fw-900 grow-1">未申請加班</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleUnOvertime + '</p></button>';
					}
					if (peopleOutTime != "") {
						html10 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="10"><p class="bl_word fs-16 fw-900 grow-1">出廠逾時</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleOutTime + '</p></button>';
					}
					if (peopleIn != "") {
						html11 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="11"><p class="bl_word fs-16 fw-900 grow-1">尚未刷進廠(廠內)</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleIn + '</p></button>';
					}
					if (peopleOut != "") {
						html12 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="12"><p class="bl_word fs-16 fw-900 grow-1">尚未刷出廠(廠內)</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleOut + '</p></button>';
					}
					if (lockCard != "") {
						html13 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="13"><p class="bl_word fs-16 fw-900 grow-1">鎖卡</p><p class="bl_word fs-30 fw-900 grow-1">' + lockCard + '</p></button>';
					}
					if (unlockCard != "") {
						html14 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="14"><p class="bl_word fs-16 fw-900 grow-1">解卡</p><p class="bl_word fs-30 fw-900 grow-1">' + unlockCard + '</p></button>';
					}
					if (cardnotOpen != "") {
						html15 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="15"><p class="bl_word fs-16 fw-900 grow-1">未開卡</p><p class="bl_word fs-30 fw-900 grow-1">' + cardnotOpen + '</p></button>';
					}
					if (peopleInFactory != "") {
						html16 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="16"><p class="bl_word fs-16 fw-900 grow-1">尚未刷進廠</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleInFactory + '</p></button>';
					}
					if (peopleOutFactory != "") {
						html17 = '<button id="unusaul" onclick="status(this)" class="btn people_btn unusaul-btn mg_0_2" value="17"><p class="bl_word fs-16 fw-900 grow-1">尚未刷出廠</p><p class="bl_word fs-30 fw-900 grow-1">' + peopleOutFactory + '</p></button>';
					}
					document.getElementById('status').innerHTML = html1 + html2 + html3 + html4 + html5 + html6 + html7 + html8 + html9 + html10 + html11 + html12 + html13 + html14 + html15 + html16 + html17;
					peoplebar(peopleUnOvertime_chart, peopleCurrent_chart, "companyout");
					peoplebar(peopleInUnOvertime_chart, peopleInCurrent_chart, "companyin");
				},
				complete: function () {
					setTimeout(people.mainpage, 600000);
					$("#overlay").fadeOut(300);
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
				}
			});
		}
	}
});
$(document).ready(function () {
	peopleUnOvertime_chart = "";
	peopleCurrent_chart = "";
	peopleInUnOvertime_chart = "";
	peopleInCurrent_chart = "";
	peoplebar(peopleUnOvertime_chart, peopleCurrent_chart, "companyout");
	peoplebar(peopleInUnOvertime_chart, peopleInCurrent_chart, "companyin");
	CookieExist('token', 'people');
	setTimeout(people.mainpage, 1000);
})
$("#overhref").click(function () {
	window.location.href = "http://192.168.50.47:8002/chart/overtime.html?type=" + "0" + "&" + "0" + "&";
});
$("#statehref").click(function () {
	window.location.href = "http://192.168.50.47:8002/chart/status.html?type=" + "1" + "&";
});
$("#Outunover").click(function () {
	window.location.href = "http://192.168.50.47:8002/chart/overtime.html?type=" + "1" + "&" + "1" + "&" + "1" + "&";
});
$("#Inunover").click(function () {
	window.location.href = "http://192.168.50.47:8002/chart/overtime.html?type=" + "1" + "&" + "1" + "&" + "2" + "&";
});
function status(event) {
	var num = event.value;
	window.location.href = "http://192.168.50.47:8002/chart/status.html?type=" + "0" + "&" + num + "&";
};

