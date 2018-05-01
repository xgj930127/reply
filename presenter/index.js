var postRequest = require("../request/PostRequest.js");
var loginUtils = require("../utils/LoginUtils.js");
var offset = 0;
var loadMoreEnable = true;
var isMoreing = false;



/**
 * 拉取数据
 * 
 * that  page对象
 */
function getPostList(that) {
  loginUtils.login({
    logined: function () {
      //必须先登录，登录完成再拉数据
      offset = 0;
      postRequest.getPostList(offset, {
        success: function (data) {
          offset = data.offset;
          loadMoreEnable = data.postList.length >= 20;
          var list = handlerResource(data);
          that.setData({
            items: list,
          });
        }
      });

    }
  });
}

/**
 * 加载更多
 */
function lower(that) {
  //没有数据了
  if (!loadMoreEnable) {
    return;
  }
  //正在加载....防止多次加载数据
  if (isMoreing) {
    return;
  }
  var items = that.data.items;
  isMoreing = true;
  postRequest.getPostList(offset, {
    success: function (data) {

      offset = data.offset;
      //有木有更多数据
      loadMoreEnable = data.postList.length >= 20;
      var list = handlerResource(data);
      var news = items.concat(list);
      that.setData({
        items: news,
      });
      isMoreing = false;
    },
    fail: function (mag) {
      isMoreing = false;
    }
  });
}

/**
 * 处理原数据
 */
function handlerResource(data) {
  var postList = data.postList;
  for (var i = 0, len = postList.length; i < len; i++) {
    postList[i].text = postRequest.getPostContent(postList[i]);
    postList[i].image = postRequest.getPostImage(postList[i]);
  }
  return postList;
}

module.exports = {
  getPostList, lower
}