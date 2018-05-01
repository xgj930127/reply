// pages/self/self.js

var httpUtils = require("../utils/HttpUtils.js");
var userRequest = require("../request/UserRequest.js");
var postRequest = require("../request/PostRequest.js");
var offset = 0;
var loadMoreEnable = true;
var isMoreing = false;




function getMyPost(that) {
  offset = 0;
  userRequest.getMyPostList(httpUtils.getUserId(), offset, {
    success: function (data) {
      wx.setStorageSync("USER_POST", data.account);
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
    userRequest.getMyPostList(httpUtils.getUserId(), offset, {
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

  function handlerResource(data) {
    var postList = data.postList;
    for (var i = 0, len = postList.length; i < len; i++) {
      postList[i].text = postRequest.getPostContent(postList[i]);
      postList[i].image = postRequest.getPostImage(postList[i]);
    }
    return postList;
  }


  module.exports = {
    getMyPost, lower
  }

