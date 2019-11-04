// //写入
// function setCookie(name,value)
// {
//   var Days = 30;
//   var exp = new Date();
//   exp.setTime(exp.getTime() + Days*24*60*60*1000);
//   document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
// }
//获取
function getCookie(name) {
  var exp = new Date();
  if (Number(localStorage.getItem(name + "_expires")) > exp.getTime()) {
    return localStorage.getItem(name) == null ? null : unescape(localStorage.getItem(name));
  } else {
    delCookie(name);
    return null;
  }
  // var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  // if(arr=document.cookie.match(reg))
  //   return unescape(arr[2]);
  // else
  //   return null;
}
//删除
function delCookie(name) {
  localStorage.removeItem(name);
  localStorage.removeItem(name + "_expires");
  // var exp = new Date();
  // exp.setTime(exp.getTime() - 1);
  // var cval=getCookie(name);
  // if(cval!=null)
  //   document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path=/;";
}

//写入，自定义存储多长时间
function setCookie(name, value, time) {
  localStorage.setItem(name, escape(value));

  if (time == null || time == undefined) { time = 'h1'; }
  var strsec = getsec(time);
  var exp = new Date();
  localStorage.setItem(name + "_expires", exp.getTime() + strsec);

  // document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/;";
}
function getsec(str) {
  var str1 = str.substring(1, str.length) * 1;
  var str2 = str.substring(0, 1);
  if (str2 == "s") {
    return str1 * 1000;
  }
  else if (str2 == "h") {
    return str1 * 60 * 60 * 1000;
  }
  else if (str2 == "d") {
    return str1 * 24 * 60 * 60 * 1000;
  }
}
