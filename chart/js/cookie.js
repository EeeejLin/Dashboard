//設定cookie
function setCookie(name, Token) {
  document.cookie = name + "=" + Token;
}
//確認cookie是否存在
function CookieExist(name, btnurl) {
  var account = name + "=";
  // var arrStr = document.cookie.split(';');
  if (document.cookie.indexOf(account) >= 0) {
    if(location.href.indexOf(btnurl) < 0){
      window.location.href = btnurl + ".html";
    }
  }
  else {
    window.location.href = "login.html?url=" + btnurl;
  }
};
//獲取Cookie
function getCookie(name) {
  var account = name + "=";
  var arrStr = document.cookie.split(';');
    if (arrStr[0].indexOf(account) == 0) {
      return arrStr[0].substring(account.length, arrStr[0].length);
    };
  return "";
};

function request(e) {
  var url = location.href;
  var id = "";
  //再來用去尋找網址列中是否有資料傳遞(QueryString)
  if (url.indexOf('?') != -1) {

    //在此直接將各自的參數資料切割放進ary中
    var ary = url.split('?')[1].split('&');
    //此時ary的內容為：
    //ary[0] = 'id=U001'，ary[1] = 'name=GQSM'     
    //下迴圈去搜尋每個資料參數
    for (i = 0; i <= ary.length - 1; i++) {
      //如果資料名稱為id的話那就把他取出來
      if (ary[i].split('=')[0] == e)
        id = ary[i].split('=')[1];
    }
  }
  return id;
};


