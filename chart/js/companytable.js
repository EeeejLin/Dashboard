let companytable = new Vue({
el: "#companytable",
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
        var InOut = ary[1];
        var TypeAll = ary[2];
        var Type = ary[3];

        console.log(dateTime);
        console.log(TypeAll);
        console.log(InOut);
        console.log(Type);
        var self=this;

        $.ajax({
        url: "http://192.168.50.47:8002/api/ExcessTable.aspx",
        method: "post", //直接傳遞物件
        data: {
            Token: getCookie('token'),
            InquireTime: dateTime,
            InquireType: TypeAll,
            CrewFactory: InOut,
            TypeName: Type,
            Export: "1",
        },
        beforeSend: function () {
            $("#overlay").fadeIn(1000);
        },
        dataType: "json",
        success: function (evt) { 
            console.log(evt);
            console.log(evt.TableData);
            if (evt.TableData.length==0) {
                $('#nodata').show();
            }
            else{
                $('#nodata').hide();
                var Url = evt.Url;//圖表匯出
                vm.message = "";
                self.items=evt.TableData;
                var title="";
                if (InOut == "0") {
                    title = "廠內無效人力列表";
                }
                else if (InOut == "1") {
                    title = "機組區無效人力列表";
                }
                document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
                document.getElementById("title").innerHTML=title;
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
CookieExist('token', 'companytable');
})    