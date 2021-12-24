let entrytable = new Vue({
    el: "#entrytable",
    data: {
        items: []
    },
    methods: { //methods是關鍵字 
        start: function () {
            $("#overlay").fadeIn(1000);
            entrytable.mainpage('0');
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
                var TypeAll = ary[1];
                var Type = ary[2];
                var self = this;

                console.log(dateTime);
                console.log(TypeAll);
                console.log(Type);


                $.ajax({
                    url: "http://192.168.50.47:8002/api/PersonPassTable.aspx",
                    method: "post", //直接傳遞物件
                    dataType: "json",
                    data: {
                        Token: getCookie('token'),
                        InquireTime: dateTime,
                        InquireType: TypeAll,
                        Name: Type,
                        Status: "0",
                        Export: "0",
                    },
                    beforeSend: function () {
                        $("#overlay").fadeIn(1000);
                    },
                    success: function (evt) {
                        if (evt.TableData.length==0) {
                            $('#nodata').show();
                        }
                        else {
                            $('#nodata').hide();
                            vm.message = "";
                            var Url = evt.Url;//圖表匯出
                            self.items = evt.TableData;
                            var title = "";
                            if (TypeAll == "0") {
                                title = "通道刷卡機人數列表";
                            }
                            else if (TypeAll == "1") {
                                title = "崗哨人數列表";
                            }
                            document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
                            document.getElementById("title").innerHTML = title;
                        }
                        $("#overlay").fadeOut(300);
                    },
                });
            }
        }
    }
});
$(document).ready(function () {
    setTimeout(entrytable.start, 1000);
    CookieExist('token', 'entrytable');
})

document.getElementById('table_select').addEventListener("change", function () {
    entrytable.items = [];
    var select = $("#table_select option:selected").val();
    let vm = this;
    var url = decodeURI(location.href);
    var id = "";
    //再來用去尋找網址列中是否有資料傳遞(QueryString)
    if (url.indexOf('?') != -1) {

        //在此直接將各自的參數資料切割放進ary中
        var ary = url.split('?')[1].split('&');
        var time = ary[0].split('=');
        var dateTime = time[1];
        var TypeAll = ary[1];
        var Type = ary[2];
        var self = this;

        console.log(dateTime);
        console.log(TypeAll);
        console.log(Type);

        $.ajax({
            url: "http://192.168.50.47:8002/api/PersonPassTable.aspx",
            method: "post", //直接傳遞物件
            dataType: "json",
            data: {
                Token: getCookie('token'),
                InquireTime: dateTime,
                InquireType: TypeAll,
                Name: Type,
                Status: select,
                Export: "0",
            },
            beforeSend: function () {
                $("#overlay").fadeIn(1000);
            },
            success: function (evt) {
                console.log(evt);
                if (evt.TableData.length==0) {
                    document.getElementById('nodata').style.visibility = "visible";
                }
                else {
                    vm.message = "";
                    var Url = evt.Url;//圖表匯出
                    entrytable.items = evt.TableData;
                    console.log(evt.TableData);
                    console.log(self.items);
                    var title = "";
                    if (TypeAll == "0") {
                        title = "通道刷卡機人數列表";
                    }
                    else if (TypeAll == "1") {
                        title = "崗哨人數列表";
                    }
                    document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
                    document.getElementById("title").innerHTML = title;
                }
                $("#overlay").fadeOut(300);
            },
        });
    }
});