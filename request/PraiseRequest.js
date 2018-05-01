var url = require("../config.js").url;
var httpUtils = require("../utils/HttpUtils.js");

/**
 * 点赞|取消点赞
 * 
 * num   0：取消 1：点赞
 * ptype  type:0（帖子）1（评论）2（回复）
 * id    传类型的id
 * resp  回调
 */
function addOrDelPraise(num, ptype,id, resp) {
  httpUtils.request({
    url: url.addOrDelPraise,
    data: {
      num: num,
      ptype: ptype,
      id: id
    },
    success: function (data) {
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}


module.exports = {
  addOrDelPraise
}