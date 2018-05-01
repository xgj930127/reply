// pages/self/self.js
var presenter = require("../../presenter/others.js");
var userId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    items: [],
  },

  lower: function (e) {
    presenter.lower(this, userId);

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userId = options.userId;
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight;
        that.setData({
          height: height,
        });
      }
    });

    presenter.getMyPostList(this, userId);
  },



  addFollow: function (e) {
    presenter.addFollow(this, userId);
  },

  cancelFollow: function (e) {
    presenter.cancelFollow(this, userId);
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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