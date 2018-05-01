var request = require('../../request/UserRequest.js');
var tokenRequest = require('../../request/CommonRequest.js');
var qiniuUploader = require("../../utils/qiniuUploader.js");

var token, key, newAvatar;

var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    about: '',
    avatar: '',
  },

  /**
   * 更换头像3---上传头像到7牛
   */
  uploade2SevenNiu: function () {
   
    var that = this;
    qiniuUploader.upload(newAvatar,
      (res) => {
       
        var newUrl = 'http://icon.polyphonytech.com/' + key;
        that.upDate(newUrl, false);
      },
      (error) => {
       
        console.log(error);
      },
      {
        key: key,
        uptoken: token,
        region: 'ECN',
      },
      (progress) => {
      }
    );
  },



  /**
   * 更换头像1---选择头像
   */
  uploadPic: function (e) {

    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0];
        wx.navigateTo({
          url: `../cropper/cropper?src=${tempFilePaths}`,
        })
      }
    });
    //更换头像2---获取token
    tokenRequest.getIconUpToken({
      success: function (data) {
        token = data.iconUpToken;
        key = data.key;
      }
    });

  },

  /**
   * 更换头像4---更新用户信息
   */
  upDate: function (newUrl, about) {
    
    var that = this;
    request.upDateUserInfo(newUrl, about, {
      success: function (data) {
       var app= getApp();
       app.globalData.changeUserInfo=true;
        wx.showToast({
          title: '保存成功',
        });
        that.setData({
          avatar: data.avatar,
          about: data.about,
        });
      }
    });
  },

  /**
   * 获取用户信息
   */
  onLoad: function (options) {
    var that = this;
    request.getUserInfo({
      success: function (data) {
        that.setData({
          avatar: data.avatar,
          about: data.about,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;
    if (app.globalData.userNewAvatar) {
    
      newAvatar = app.globalData.userNewAvatar;
      app.globalData.userNewAvatar=undefined;
      that.setData({
        avatar:newAvatar
      });
      
      //选择好了头像
      //更换头像2---获取token
      if (token && key) {
        that.uploade2SevenNiu();
      } else {
        tokenRequest.getIconUpToken({
          success: function (data) {
            token = data.iconUpToken;
            key = data.key;
            that.uploade2SevenNiu();
          }
        });
      }
    }
  },

  bindFormSubmit: function (e) {
    var that = this;
    var text=e.detail.value.textarea;
    this.upDate(false,text);
  },

  
})

// Page({
//   data: {

//   },

//   onLoad: function (options) {

//   },



//   focus: function () {
//     var that = this;
//     console.log(that.data.showView)
//     if (!that.data.showView) {
//       that.setData({
//         showView: (!that.data.showView)
//       });
//     }
//   },









// })
