var url = require("../config.js").url;
var httpUtils = require("../utils/HttpUtils.js");

/**
 * 评论详情接口
 * 
 * postId    帖子id
 * offset  起始值
 * resp  回调
 */
function getCommentListById(postId, offset, resp) {
  httpUtils.request({
    url: url.getCommentListById,
    data: {
      postId: postId,
      offset: offset,
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
 * 添加评论
 * 
 * postId    帖子id
 * content  评论内容
 * resp  回调
 */
function addComment(postId, content, resp) {
  httpUtils.request({
    url: url.addComment,
    data: {
      postId: postId,
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
 * 删除评论
 * 
 * commentId    评论id
 * resp  回调
 */
function delCommentById(commentId, resp) {
  httpUtils.request({
    url: url.delCommentById,
    data: {
      commentId: commentId,
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
 * 添加回复
 * 
 * postId       帖子id
 * commentId    评论id
 * replayId     回复id(如果没有填写评论id)
 * replayUserId 回复谁
 * content  评论内容
 * resp  回调
 */
function addReplay(postId, commentId, replayId, replayUserId, content, resp) {
  httpUtils.request({
    url: url.addReplay,
    data: {
      postId: postId,
      commentId: commentId,
      replayId: replayId,
      replayUserId: replayUserId,
      content: content
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
 * 评论下面的回复
 */
function getReplayListByCommentId(commentId, offset, resp){
  httpUtils.request({
    url: url.getReplayListByCommentId,
    data: {
      commentId: commentId,
      offset: offset,
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
 * 删除回复
 * 
 * replayId     回复id
 * resp  回调
 */
function delReplayById(replayId, resp) {
  httpUtils.request({
    url: url.delReplayById,
    data: {
     replayId: replayId,
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
  addComment, delCommentById, addReplay, delReplayById, getCommentListById, getReplayListByCommentId
}