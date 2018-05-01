// pages/self/self.js
var presenter = require("../../presenter/self.js");
var eventUtils = require("../../utils/EventUtils.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    items: [],
  },

  lower: function (e) {
    presenter.lower(this);

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    eventUtils.register(that, 'refreshSelf');
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight;
        that.setData({
          height: height,
        });
      }
    });

    presenter.getMyPost(this);

  },

  refresh: function (res) {
    presenter.getMyPost(this);
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
    var app = getApp();

    if (app.globalData.userSendNewPost) {
      presenter.getMyPost(this);
      app.globalData.userSendNewPost = false;
    }

    if (app.globalData.changeUserInfo) {
      presenter.getMyPost(this);
      app.globalData.changeUserInfo = false;
    }

    var info = wx.getStorageSync("USER_POST");
    this.data.account=info;
    if (info) {
      this.setData({
        info: info,
      });
    }
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
    eventUtils.unregister('refreshSelf');
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