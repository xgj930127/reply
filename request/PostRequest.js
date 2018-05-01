var url = require("../config.js").url;
var httpUtils = require("../utils/HttpUtils.js");

/**
 * 发帖
 * 
 * title    标题
 * content  内容
 * resp  回调
 */
function addPost(title, content, resp) {
  httpUtils.request({
    url: url.addPost,
    data: {
      title: title,
      content: content,
    },
    success: function (data) {
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}


/**
 * 删除帖子
 * 
 * postId    帖子id
 * resp  回调
 */
function delPostById(postId, resp) {
  httpUtils.request({
    url: url.delPostById,
    data: {
      postId: postId
    },
    success: function (data) {
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}


/**
 * 修改转发数
 * 
 * postId    帖子id
 * resp  回调
 */
function getUpdateTrunNum(postId, resp) {
  httpUtils.request({
    url: url.getUpdateTrunNum,
    data: {
      postId: postId
    },
    success: function (data) {
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}


/**
 * 推荐接口
 * 
 * offset    起始值
 * resp  回调
 */
function getPostList(offset, resp) {
  httpUtils.request({
    url: url.getPostList,
    data: {
      offset: offset
    },
    success: function (data) {
      if (resp) {
        resp.success(data);
      }
    },
    fail: function (msg) {
      if (resp && httpUtils.isHostMethod(resp, "fail")) {
        resp.fail(msg);
      }
    }
  }
  );
}


/**
 * 帖子详情接口
 * 
 * postId    帖子id
 * resp  回调
 */
function getPostById(postId, resp) {
  httpUtils.request({
    url: url.getPostById,
    data: {
      postId: postId
    },
    success: function (data) {
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}


function getPostContent(post) {
  var content = post.content;
  var text;
  if (content.charAt(0) == '[' && content.charAt(content.length - 1) == ']') {
    //JSON
    var content = JSON.parse(post.content);
    for (var i = 0, len = content.length; i < len; i++) {
      var widget = content[i];
      if (widget.widgetType == 'text') {
        text = widget.text;
        break;
      }
    }
  }else{
    text = content;
  }
  return text;
}


function getPostImage(post) {
  var content = post.content;
  var imgUrl;

  if (content.charAt(0) == '[' && content.charAt(content.length - 1) == ']') {
    //JSON
    var content = JSON.parse(post.content);
    for (var i = 0, len = content.length; i < len; i++) {
      var widget = content[i];
      if (widget.widgetType == 'img') {
        imgUrl = widget.imgUrl;
        break;
      }
    }
  }
  return imgUrl;
}

module.exports = {
  addPost, delPostById, getUpdateTrunNum, getPostList, getPostById, getPostImage, getPostContent
}