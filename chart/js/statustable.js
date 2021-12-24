let companytable = new Vue({
el: "#statustable",
data: {
    items:[]
},
methods: { //methods是關鍵字 
    start: function () {
        $("#overlay").fadeIn(1000);
        companytable.mainpage('0');
    },
    mainpage: function () {
    let vm = this;
    var url = decodeURI(location.href);
    var id = "";
    //再來用去尋找網址列中是否有資料傳遞(QueryString)
    if (url.indexOf('?') != -1) {

        //在此直接將各自的參數資料切割放進ary中
        var ary = url.split('?')[1].split('&');
        var time = ary[0].split('=');
        var dateTime = time[1];
        console.log(dateTime);
        var TypeAll = ary[1];
        console.log(TypeAll);
        var self=this;


        $.ajax({
        url: "http://192.168.50.47:8002/api/StatusList.aspx",
        method: "post", //直接傳遞物件
        dataType: "json",
        data: {
            Token: getCookie('token'),
            Result:TypeAll,
            Date:dateTime,
            Down:"1",
        },
        beforeSend: function () {
            $("#overlay").fadeIn(1000);
        },
        success: function (evt) { 
            console.log(evt);
            if (evt.length==0||evt[0].Data.length==0) {
                $('#nodata').show();
            }
            else{
                $('#nodata').hide();
                vm.message = "";
                var Url = evt[0].Url;//圖表匯出
                self.items=evt[0].Data;
                document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
                document.getElementById("title").innerHTML="異常狀態列表";
            }
            $("#overlay").fadeOut(300);
        },
        });
    }
    }
}
});
$(document).ready(function () {
setTimeout(companytable.start, 1000);
})    