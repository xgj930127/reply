// pages/self/self.js
var userRequest = require("../request/UserRequest.js");
var followRequest = require("../request/FollowRequest.js");
var postRequest = require("../request/PostRequest.js");
var offset = 0;
var loadMoreEnable = true;
var isMoreing = false;



/**
 * 获取列表
 */
function getMyPostList(that, userId) {
  offset = 0;
  userRequest.getMyPostList(userId, offset, {
    success: function (data) {
      offset = data.offset;
      loadMoreEnable = data.postList.length >= 20;
      var list = handlerResource(data);
      that.setData({
        info: data.account,
        items: list,
      });
    }
  });
}


function lower(that, userId) {
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
  userRequest.getMyPostList(userId, offset, {
    success: function (data) {

      var info = data.account;
      offset = data.offset;
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







function addFollow(that, userId) {
  followRequest.addFollow(userId, {
    success: function (data) {
      var info = that.data.info;
     info.fans = info.fans + 1;
      info.followState = data.followState;
      that.setData({
        info: info,
      });

    }
  });
}

function cancelFollow(that, userId) {

  followRequest.cancelFollow(userId, {
    success: function (data) {
      var info = that.data.info;
      info.fans = info.fans - 1;
      if (info.fans < 0) {
        info.fans = 0;
      }
      info.followState = data.followState;
      that.setData({
        info: info,
      });
    }
  });
}

function handlerResource(data) {

  var postList = data.postList;
  for (var i = 0, len = postList.length; i < len; i++) {
    postList[i].text = postRequest.getPostContent(postList[i]);
    postList[i].image = postRequest.getPostImage(postList[i]);
  }
  return postList;
}





module.exports = {
  getMyPostList, lower, addFollow, cancelFollow
}
