function  addZero(num) {
 return  num>=10?num: "0" + num;
}

function getTimeStr(time) {
  var t = new Date(time),
      oyear = t.getFullYear(),
      omonth = t.getMonth() + 1,
      oday = t.getDate(),
      ohour = t.getHours(),
      ominute = t.getMinutes(),
      osec = t.getSeconds(),
      otime = oyear + "-" + omonth + "-" + oday + " " + 
      addZero(ohour) + ":" + addZero(ominute) + ":" + addZero(osec);
  return otime;
}

export default getTimeStr;