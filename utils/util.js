

/**
 * 评论显示的时间
 * 
 * 
 * 1小时内，显示“23分钟前”
 * 1-24小时内，显示“2小时前”，四舍五入
 * 24小时以上，显示日期“3月21日”
 */
function getShowTime(res) {
  res = res.replace(/-/g, '/');
  var data = new Date();
  res = new Date(res);
  //大于多年
  if (data.getFullYear() != res.getFullYear())
    return res.getFullYear() + '年' +
      (res.getMonth() + 1) + '月' +
      +res.getDate() + '日';
  // //大于多月
  // if (data.getMonth() != res.getMonth())
  //   return (res.getMonth() + 1) + '月' +
  //     +res.getDate() + '日';
  // //大于1天
  // var day = 1000 * 60 * 60 * 24;//1天
  // if (data.getTime() - res.getTime() > day)
  //   return (res.getMonth() + 1) + '月' +
  //     +res.getDate() + '日';

  //大于多时
  var hour = 1000 * 60 * 60;
  var h = (data.getTime() - res.getTime()) / hour;
  h = Math.round(h);
  if (h >= 24) {
    return (res.getMonth() + 1) + '月' +
      +res.getDate() + '日';
  }
  if (h > 0) {
    return h + "小时前";
  }
  //大于多分钟
  var min = 1000 * 60;
  var m = (data.getTime() - res.getTime()) / min;
  m = Math.round(m);
  if (m >= 2) {
    return m + "分钟前";
  }
  return "刚刚";
}

/**
 * 评论显示的时间
 * 
 * 
 * 1小时内，显示“23分钟前”
 * 1-24小时内，显示“2小时前”，四舍五入
 * 24小时以上，显示日期“3月21日”
 */
function formatTime(res) {
  res = res.replace(/-/g, '/');
  res = new Date(res);
  return res.getFullYear() + '年' +
    (res.getMonth() + 1) + '月' +
    +res.getDate() + '日';
}





function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 传入字符串或者数字类型
function isCorrectPhone(number) {
  var t = number.toString().trim();
  var r = false;

  if (t.length === 11) {
    r = true;
  }
  return r;
}

// 传入字符串
function isCorrectAddress(address) {
  var t = address.trim();
  var r = false;

  if (t.length !== 0) {
    r = true;
  }
  return r;
}

// 是否合格姓名 传入字符串
function isCorrectName(userName) {
  var t = userName.trim();
  var r = false;

  if (t.length !== 0) {
    r = true;
  }
  return r;
}

module.exports = {
  formatTime: formatTime,
  isCorrectPhone: isCorrectPhone,
  isCorrectAddress: isCorrectAddress,
  isCorrectName: isCorrectName,
  getShowTime: getShowTime
}
