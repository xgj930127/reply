var url = require("../config.js").url;
var httpUtils = require("../utils/HttpUtils.js");


/**
 * 关注
 * 
 * followId   去关注人的id
 * resp  回调
 */
function addFollow(followId, resp) {
  httpUtils.request({
    url: url.addFollow + followId,
    data: {},
    success: function (data) {
      var info = wx.getStorageSync("USER_POST");
      if (info) {
        info.follow = info.follow + 1;
        wx.setStorageSync("USER_POST", info);
      }
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}


/**
 * 取消关注
 * 
 * followId   去关注人的id
 * resp  回调
 */
function cancelFollow(followId, resp) {
  httpUtils.request({
    url: url.cancelFollow + followId,
    data: {},
    success: function (data) {
      var info = wx.getStorageSync("USER_POST");
      if (info) {
        info.follow = info.follow - 1;
        if (info.follow < 0) {
          info.follow = 0;
        }
        wx.setStorageSync("USER_POST", info);
      }
      if (resp) {
        resp.success(data);
      }
    }
  }
  );

}

module.exports = {
  addFollow, cancelFollow
}