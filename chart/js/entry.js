$(document).ready(function () {
	CookieExist('token', 'entry');
	setTimeout(entry.mainpage, 1000);
})
let entry = new Vue({
	el: "#entry",
	data: {
		faceNorthRate: '',
		faceSouthRate: '',
		faceFourRate: '',
		FCnorthRate: '',
		FCsouthRate: '',
		FCfourRate: '',
		FCnorthPass: '',
		FCsouthPass: '',
		FCfourPass: '',
		FCnorthFail: '',
		FCsouthFail: '',
		FCfourFail: '',
	},
	methods: { //methods是關鍵字 
		mainpage: function () {
			$.ajax({
				url: "http://192.168.50.47:8002/api/KioskPass.aspx",
				dataType: "json",
				method: "post", //直接傳遞物件
				data: {
					Token: getCookie('token'),
				},
				beforeSend:function () {
					$("#overlay").fadeIn(1000);
				},
				success: function (evt) {
					console.log(evt);
					entry.faceNorthRate = evt.NorthKioskFace;
					entry.faceSouthRate = evt.SouthKioskFace;
					entry.faceFourRate = evt.FourKioskFace;
					entry.FCnorthRate = evt.NorthKioskPerson;
					entry.FCsouthRate = evt.SouthKioskPerson;
					entry.FCfourRate = evt.FourKioskPerson;
					entry.FCnorthPass = evt.NorthKioskPass;
					entry.FCsouthPass = evt.SouthKioskPass;
					entry.FCfourPass = evt.FourKioskPass;
					entry.FCnorthFail = evt.NorthKioskFail;
					entry.FCsouthFail = evt.SouthKioskFail;
					entry.FCfourFail = evt.FourKioskFail;
					$('.faceN_piechart').attr('data-percent', entry.faceNorthRate);
					$('.faceS_piechart').attr('data-percent', entry.faceSouthRate);
					$('.faceF_piechart').attr('data-percent', entry.faceFourRate);
					$('.FCN_piechart').attr('data-percent', entry.FCnorthRate);
					$('.FCS_piechart').attr('data-percent', entry.FCsouthRate);
					$('.FCF_piechart').attr('data-percent', entry.FCfourRate);
				},
				complete: function () {
					setTimeout(entry.mainpage, 120000);
					var today =new Date();
					var y = today.getFullYear();//年份
					//不足兩位數補零
					var mo = (today.getMonth() + 1 < 10 ? '0' : '') + (today.getMonth() + 1);//月份
					var d = (today.getDate() < 10 ? '0' : '') + today.getDate();//日期
					var h = (today.getHours() < 10 ? '0' : '') + today.getHours();//小時
					var m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();//分鐘
					var s = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();//秒
					var currentDateTime =y+'/'+mo+'/'+d+'/ '+h+':'+m+':'+s;
					document.getElementById('refreshtime').innerHTML='更新時間：'+ currentDateTime;
					drawchart('FCN_piechart', 'FCN_progress-fill');
					drawchart('FCS_piechart', 'FCS_progress-fill');
					drawchart('FCF_piechart', 'FCF_progress-fill');
					drawchart('faceN_piechart', 'faceN_progress-fill');
					drawchart('faceS_piechart', 'faceS_progress-fill');
					drawchart('faceF_piechart', 'faceF_progress-fill');
					$("#overlay").fadeOut(300);
				}
			});
		}
	}
});