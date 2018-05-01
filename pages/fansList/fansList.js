// pages/fansList/fansList.js
var followRequest = require("../../request/FollowRequest.js");
var userRequest = require("../../request/UserRequest.js");
var httpUtils = require("../../utils/HttpUtils.js");

var type, id;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //类型   follow  /  fan
    console.log(options);
    type = options.type;
    var title = "";
    if (type == "follow") {
      title = "我关注的人";
    } else {
      title = "我的粉丝";
    };
    wx.setNavigationBarTitle({
      title: title//页面标题为路由参数
    });
    //id

    id = options.id;
    this.getNetData(0);
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight - 64;
        that.setData({
          height: height,
          type: type,
        });
      }
    });
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

    this.getNetData(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getNetData(this.data.list.length);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //关注或者取消关注点击事件
  attentionClick: function (event) {
    if (httpUtils.getUserId() != id) {
      return;
    }
    var index = event.currentTarget.dataset.hi;
    var smallList = this.data.list[index];
    if (smallList.followState == 0) {
      smallList.followState = 1;
      if (type == "follow") {
        this.addFollow(smallList.followUserId);
      } else {
        this.addFollow(smallList.fansUserId);
      }
    } else {
      smallList.followState = 0;
      if (type == "follow") {
        this.cancelFollow(smallList.followUserId);
      } else {
        this.cancelFollow(smallList.fansUserId);
      }
    }
    this.setData({ list: this.data.list });

  },
  //关注
  addFollow: function (followId) {
    followRequest.addFollow(followId, {
      success: function (data) {
      }
    })
  },

  //取消关注
  cancelFollow: function (followId) {
    followRequest.cancelFollow(followId, {
      success: function (data) {

      }
    })
  },
  //网络请求接口函数
  getNetData: function (page) {

    var that = this;
    if (type == "follow") {
      userRequest.pageGetFollow(page, id, {
        success: function (data) {
          if (page == 0) {

            that.setData({ list: data });
          } else {
            that.setData({ list: that.data.list.concat(data) });
          }
        }
      });
    } else {
      userRequest.pageGetFans(page, id, {
        success: function (data) {
          if (page == 0) {

            that.setData({ list: data });
          } else {
            that.setData({ list: that.data.list.concat(data) });
          }
        }
      });
    }

  },


})