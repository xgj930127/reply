
var eventUtils = require("../../utils/EventUtils.js");
var presenter = require("../../presenter/details.js");
var postId;



Page({
  data: {
    postList: [],
    commentList: [],
    post: '',

  },
  onLoad: function (res) {
    postId = res.postId;
    eventUtils.register(this, 'refreshDetail');
    presenter.getPostDetail(this, postId);
  },


  refresh: function (res) {
    presenter.getPostDetail(this, postId);
  },

  addFollow: function (e) {
    presenter.addFollow(this);
  },

  cancelFollow: function (e) {
    presenter.cancelFollow(this);
  },

  praise: function (e) {
    var id = e.currentTarget.id;
    var state = e.currentTarget.dataset.praisstate;
    var ptype = e.currentTarget.dataset.type;
    presenter.praise(this, id, state, ptype);
  },


  commentAt: function(e){
   
   var postId = e.currentTarget.dataset.postId;
   var commentId = e.currentTarget.dataset.commentId;
   var replayId = e.currentTarget.dataset.replayId;
   var replayUserId = e.currentTarget.dataset.replayUserid;
   var nickname = e.currentTarget.dataset.nickname; 
  wx.navigateTo({
    url: '../comment/comment?postId=' + postId +'&commentId='+commentId
    + '&replayId=' + replayId + '&replayUserId=' + replayUserId
    + '&nickname=' + nickname,
    })
  },

  /**
 * 点赞逻辑
 */
  praiseReplay: function (e) {
    //处理的id
    var id = e.currentTarget.id;
    //点赞状态  true 已经点赞
    var state = e.currentTarget.dataset.praisstate;
    //方式  0（帖子）1（评论）2（回复）
    var ptype = e.currentTarget.dataset.type;
    //评论id
    var commentId = e.currentTarget.dataset.commentId;

    presenter.praiseReplay(this, id, state, ptype, commentId);
  },


  share: function (e) {
    presenter.share(postId);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    eventUtils.unregister('refreshDetail');
  },
})
