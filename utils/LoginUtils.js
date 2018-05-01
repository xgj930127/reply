
const KEY_LOGINED = "LOGINED";

/**
 * 登录操作，
 */
function login(resp) {
  if (!resp) return;
  
  if (!isLogined()) {
    var userRequest = require("../request/UserRequest.js");
    userRequest.login({
      success: function (data) {
        resp.logined();
        savdLogined(data);
      }
    });
  } else {
    resp.logined();
  }
}

function isLogined(){
  return wx.getStorageSync(KEY_LOGINED);
}

function savdLogined(data){
  wx.setStorageSync(KEY_LOGINED, data);
}

function loginOut(){
  wx.removeStorageSync(KEY_LOGINED);
}


module.exports = {
  login,loginOut
}