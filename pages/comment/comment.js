var eventUtils = require("../../utils/EventUtils.js");
var presenter = require("../../presenter/comment.js");
var postId;


var isCommend = false;
var commentId, postId, replayId, replayUserId, nickname;

Page({
  data: {
    commentList: [],
    avatar: '',
    content: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    postId = options.postId;
    //加载数据
    presenter.loadList(this, postId);
    wx.getSystemInfo({
      success: function (res) {
        var width = res.windowWidth;
        var height = res.windowHeight;
        //px 200
        // var px = 100 / 750 * res.windowWidth;

        // console.log(px);
        that.setData({
          height: height - 70,
        });
      }
    });
    commentId = options.commentId;
    replayId = options.replayId;
    replayUserId = options.replayUserId;
    nickname = options.nickname; 
    
    if (nickname){
      this.setData({
        content: '@' + nickname + " ",
      });
    }
  },


  /**
   * 加载更多
   */
  lower: function (e) {
    presenter.lower(this, postId);
  },



  /**
   * 加载更多回复
   */
  commentMore: function (e) {
    var commentId = e.currentTarget.id;
    presenter.commentMore(this, commentId);
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

 



  /**
   * @谁进行评论
   */
  commentAt: function (e) {
    console.log(e);
    commentId = e.currentTarget.dataset.commentId;
    postId = e.currentTarget.dataset.postId;
    replayId = e.currentTarget.dataset.replayId;
    replayUserId = e.currentTarget.dataset.replayUserid;
    nickname = e.currentTarget.dataset.nickname;
    this.setData({
      content: '@' + nickname + " ",
    });
  },

  /**
   * 发送评论
   */
  sendComment: function (e) {
    var content = e.detail.value;
    isCommend = true;
    presenter.sendComment(this, content, nickname, postId, commentId, replayId, replayUserId);
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    presenter.setSelfIcon(this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (isCommend) {
      eventUtils.post('refreshDetail');
      isCommend = false;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
