var url = require("../config.js").url;
var httpUtils = require("../utils/HttpUtils.js");


/**
 * 获取七牛的图片 token
 * 
 * resp  回调
 */
function getIconUpToken(resp) {
  httpUtils.request({
    url: url.getIconUpToken,
    data: { type:'png'},
    success: function (data) {
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}


/**
 * 获取七牛的token
 * 
 * resp  回调
 */
function getVideoUpToken(resp) {
  httpUtils.request({
    url: url.getVideoUpToken,
    data: { type: 'mp4' },
    success: function (data) {
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}




module.exports = {
  getIconUpToken, getVideoUpToken
}