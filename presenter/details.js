var postRequest = require("../request/PostRequest.js");
var followRequest = require("../request/FollowRequest.js");
var praiseRequest = require("../request/PraiseRequest.js");
var timeUtils = require("../utils/util.js");
var userId;


/**
 * 获取详情页信息
 */
function getPostDetail(that, postId) {
  postRequest.getPostById(postId, {
    success: function (data) {
      userId = data.post.userId;
      var post = data.post;
      post.ctime = timeUtils.formatTime(post.ctime);
      post.content = JSON.parse(post.content);

      var postList = data.postList;
      if (postList) {
        for (var i = 0, len = postList.length; i < len; i++) {
          postList[i].text = postRequest.getPostContent(postList[i]);
          postList[i].image = postRequest.getPostImage(postList[i]);
        }
      }

      var commentList = data.commentList;
      for (var i = 0, len = commentList.length; i < len; i++) {
        commentList[i].ctime = timeUtils.getShowTime(commentList[i].ctime);
        commentList[i].hasMore = commentList[i].replayList.length > 1;
        if (commentList[i].replayList.length > 1) {
          commentList[i].replayList.pop();
        }
      }
      that.setData({
        post: post,
        postList: postList,
        commentList: commentList,
      });

    }
  });
}

/**
 * 添加关注
 */
function addFollow(that) {
  followRequest.addFollow(userId, {
    success: function (data) {
      var post = that.data.post;
      post.followState = data.followState;
      that.setData({
        post: post,
      });

    }
  });
}

/**
 * 取消关注
 */
function cancelFollow(that) {
  followRequest.cancelFollow(userId, {
    success: function (data) {
      var post = that.data.post;
      post.followState = data.followState;
      that.setData({
        post: post,
      });
    }
  });
}

/**
 * 点赞
 */
function praise(that, id, state, ptype) {
  praiseRequest.addOrDelPraise(state ? 0 : 1, ptype, id, {
    success: function (data) {
      if (data.isResult == "1") {
        handlePostParise(that, state);
      }

      if (data.isResult == "3") {
        wx.showToast({
          title: '该文章已删除',
          icon: "none",
        })
      }

      if (data.isResult == "2") {
        wx.showToast({
          title: '重复点赞',
          icon: "none",
        })
      }
      if (data.isResult == "0") {
        wx.showToast({
          title: '失败',
          icon: "none",
        })
      }
    }
  });
}

/**
 * 处理点赞逻辑
 */
function handlePostParise(that, state) {
  var post = that.data.post;
  if (state) {
    //取消点赞
    post.praiseState = '0';
    var num = post.praiseNum - 1;
    if (num < 0) {
      num = 0;
    }
    post.praiseNum = num;

  } else {
    //点赞
    post.praiseState = '1';
    post.praiseNum = post.praiseNum + 1;
  }

  that.setData({
    post: post,
  });

}

/**
 * 评论点赞逻辑
 */
function praiseReplay(that, id, state, ptype, commentId) {

  if (ptype == '1') {
    commentId = id;
  }

  //0：取消 1：点赞
  praiseRequest.addOrDelPraise(state ? 0 : 1, ptype, id, {
    success: function (data) {
      if (data.isResult == "1") {
        handleParise(that, commentId, id, ptype, state);
      }


      if (data.isResult == "3") {
        wx.showToast({
          title: '该条评论已删除',
          icon: "none",
        })
      }

      if (data.isResult == "2") {
        wx.showToast({
          title: '重复点赞',
          icon: "none",
        })
      }
      if (data.isResult == "0") {
        wx.showToast({
          title: '失败',
          icon: "none",
        })
      }
    }
  });
}

/**
 * 点赞成功后，修改原始数据
 */
function handleParise(that, commentId, replayId, ptype, state) {
  //原数据
  var list = that.data.commentList;
  for (var i = 0, len = list.length; i < len; i++) {
    //拿到处理的评论
    if (list[i].id == commentId) {
      if (ptype == '1') {
        //处理评论的点赞逻辑
        var num = list[i].praiseNum;
        if (state) {
          list[i].commentPraisState = "0";
          num--;
          if (num < 0) num = 0;
        } else {
          list[i].commentPraisState = "1";
          num++;
        }
        list[i].praiseNum = num;
      } else {
        //处理回复的点赞逻辑
        var replayList = list[i].replayList;
        for (var j = 0, lenj = replayList.length; j < lenj; j++) {

          if (replayList[j].id == replayId) {
            var num = replayList[j].praiseNum;
            if (state) {
              replayList[j].replayPraisState = "0";
              num--;
              if (num < 0) num = 0;
            } else {
              replayList[j].replayPraisState = "1";
              num++;
            }
            replayList[j].praiseNum = num;
            break;
          }

        }
      }
      break;
    }
  }

  that.setData({
    commentList: list,
  });
}



function share(postId) {
  postRequest.getUpdateTrunNum(postId,
    {
      success: data => {

      }
    }
  );
}

module.exports = {
  getPostDetail, addFollow, cancelFollow, praise, praiseReplay, share
}