
var commentRequest = require("../request/CommentRequest.js");
var userRequest = require("../request/UserRequest.js");
var praiseRequest = require("../request/PraiseRequest.js");
var timeUtils = require("../utils/util.js");
var postId;
var offset = 0;
var loadMoreEnable = true;
var isMoreing = false;






/**
 * 加载数据
 */
function loadList(that, postId) {
    offset = 0;
    commentRequest.getCommentListById(postId, offset, {
      success: function (data) {
        offset = data.offset;
        var list = data.commentList;
        loadMoreEnable = list.length >= 20;
        list = handleSourceData(list);
        wx.setNavigationBarTitle({ title: data.commentNum + " 条评论" });
        that.setData({
          commentList: list,
        });
      }
    });
  }


  /**
   * 加载更多
   */
function lower(that, postId) {
    //没有数据了
    if (!loadMoreEnable) {
      return;
    }
    //正在加载....防止多次加载数据
    if (isMoreing) {
      return;
    }
    var items = that.data.commentList;
  
    isMoreing = true;

    commentRequest.getCommentListById(postId, offset, {
      success: function (data) {
        offset = data.offset;
        var list = data.commentList;
        loadMoreEnable = list.length >= 20;
        list = handleSourceData(list);
        var news = items.concat(list);
        that.setData({
          commentList: news,
        });
        isMoreing = false;
      },
      fail: function (msg) {
        isMoreing = false;
      }
    });
  }


  /**
   * 处理返回的原始数据
   */
function  handleSourceData (list) {
    for (var i = 0, len = list.length; i < len; i++) {
      var comment = list[i];
      comment.ctime = timeUtils.getShowTime(comment.ctime);
      comment.hasMore = comment.replayList.length > 3;
      if (comment.replayList.length > 3) {
        comment.replayList.pop();
      }
      var replay = comment.replayList;
      for (var j = 0, lenj = replay.length; j < lenj; j++) {
        replay[j].ctime = timeUtils.getShowTime(replay[j].ctime);
      }
    }
    return list;
  }

  /**
   * 点赞逻辑
   */
function praiseReplay(that, id, state, ptype, commentId) {

    if (ptype == '1') {
      commentId = id;
    }

    //0：取消 1：点赞
    praiseRequest.addOrDelPraise(state ? 0 : 1, ptype, id, {
      success: function (data) {
        if (data.isResult == "1") {
          handleParise(that,commentId, id, ptype, state);
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
  function handleParise(that,commentId, replayId, ptype, state) {
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





  /**
   * 发送评论
   */
  function sendComment(that, content, nickname,
    postId, commentId, replayId, replayUserId,) {
    //含有回复谁
    if (content.indexOf('@' + nickname) != -1) {
      content = content.substring(nickname.length + 2);
      commentRequest.addReplay(postId, commentId,
        replayId, replayUserId, content, {
          success: function (data) {
            that.setData({
              content: '',
            });
            loadList(that, postId);

          }
        });
    } else {
      //对帖子进行评论
      commentRequest.addComment(postId, content, {
        success: function (data) {
          that.setData({
            content: '',
          });
          loadList(that,postId);
        }
      });
    }
  }


  /**
   * 加载更多回复
   */
function commentMore(that,commentId) {
    var list = that.data.commentList;
    var offset = 0;
    var index, comment;
    for (var i = 0, len = list.length; i < len; i++) {
      if (list[i].id == commentId) {
        if (list[i].offset) {
          offset = list[i].offset;
        }
        index = i;
        comment = list[i];
        break;
      }
    };
    if (!comment) return;
    if (comment.isLoading) {
      return;
    }
    comment.isLoading = true;
    commentRequest.getReplayListByCommentId(commentId, offset, {
      success: function (data) {
        var replay = data.replayList;
        //没有更多数据
        if (!replay || replay.length == 0) {
          comment.hasMore = false;
          comment.isLoading = false;
          list[index] = comment;
          that.setData({
            commentList: list,
          });
          return;
        }
        //有更多数据
        for (var j = 0, lenj = replay.length; j < lenj; j++) {
          replay[j].ctime = timeUtils.getShowTime(replay[j].ctime);
        }
        var newList = comment.replayList.concat(replay);
        //修改属性
        comment.offset = data.offset;
        comment.isLoading = false;
        comment.replayList = newList;
        list[index] = comment;
        that.setData({
          commentList: list,
        });
      },
      fail: function (msg) {
        comment.isLoading = false;
        list[index] = comment;
      }
    })
  }


  /**
   * 设置输入框头像
   */
function setSelfIcon(that) {
    userRequest.getUserInfoFromCache({
      success: function (data) {
        that.setData({
          avatar: data.avatar,
        });
      }
    });
  }


module.exports = {
  loadList, lower, setSelfIcon, commentMore, praiseReplay, sendComment
}