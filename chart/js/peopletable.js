let peopletable = new Vue({
    el: "#peopletable",
    data: {
        items: []
    },
    methods: { //methods是關鍵字 
        start: function () {
            peopletable.mainpage('0');
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
                var Sort = ary[3];
                var self = this;

                console.log(dateTime);
                console.log(TypeAll);
                console.log(Type);
                console.log(Sort);

                $.ajax({
                    url: "http://192.168.50.47:8002/api/OverTimeList.aspx",
                    method: "post", //直接傳遞物件
                    dataType: "json",
                    data: {
                        Token: getCookie('token'),
                        Date: dateTime,
                        Type: TypeAll,
                        Name: Type,
                        NameType: Sort,
                        Down: "1",
                    },
                    beforeSend: function () {
                        $("#overlay").fadeIn(1000);
                    },
                    success: function (evt) {
                        console.log(evt);
                        if (evt.length == 0 || evt[0].Data.length == 0) {
                            $('#nodata').show();
                        }
                        else {
                            console.log(evt[0].Data);
                            $('#nodata').hide();
                            var html = "";
                            var Id = $.map(evt[0].Data, function (item, index) {
                                return item.Id;
                            })
                            var Name = $.map(evt[0].Data, function (item, index) {
                                return item.Name;
                            })
                            var Time = $.map(evt[0].Data, function (item, index) {
                                return item.Time;
                            })
                            var Phone = $.map(evt[0].Data, function (item, index) {
                                return item.Phone;
                            })
                            var Company = $.map(evt[0].Data, function (item, index) {
                                return item.Company;
                            })
                            var Group = $.map(evt[0].Data, function (item, index) {
                                return item.Group;
                            })
                            var WorkPlace = $.map(evt[0].Data, function (item, index) {
                                return item.WorkPlace;
                            })
                            var File = $.map(evt[0].Data, function (item, index) {
                                return item.File;
                            })
                            for (var i = 0; i < evt[0].Data.length; i++) {
                                // if(File[i] ==""){
                                //     html += '<tr><td>' + Id[i] + '</td><td>' + Time [i] + '</td><td>' + Name[i] + '</td><td>' + Phone [i] + '</td><td>' + Company [i] + '</td><td>' + Group [i] + '</td><td>' + WorkPlace [i] + '</td><td style="padding-right: 30px"></td></tr>';
                                // }
                                // else{
                                html += '<tr><td>' + Id[i] + '</td><td>' + Time[i] + '</td><td>' + Name[i] + '</td><td>' + Phone[i] + '</td><td>' + Company[i] + '</td><td>' + Group[i] + '</td><td>' + WorkPlace[i] + '</td><td style="padding-right: 30px"><a id="btn" class="people_btn output align-right" style="margin:0 auto;!important" target="_blank" title="加班單" href="' + File[i] + '">檢閱</a></td></tr>';
                                // }
                            }
                            var Url = evt[0].Url;//圖表匯出
                            var title = "";
                            if (TypeAll == "0") {
                                title = "加班人數列表";
                            }
                            else if (TypeAll == "1") {
                                title = "未申請加班人數列表";
                            }
                            console.log(html);
                            var a = document.getElementById('render');
                            document.getElementById('render').innerHTML = html;
                            console.log(a.innerHTML);
                            document.getElementById('printbtn').href = "http://192.168.50.47:8002" + Url;
                            document.getElementById("title").innerHTML = title;
                        }
                        $("#overlay").fadeOut(300);
                    },
                    complete: function () {
                    }
                });
            }
        }
    }
});

$(document).ready(function () {
    setTimeout(peopletable.start, 1000);
}) 