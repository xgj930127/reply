var request = require('../request/UserRequest.js');
var tokenRequest = require('../request/CommonRequest.js');
var qiniuUploader = require("../utils/qiniuUploader.js");

var token, key;


/**
 * 获取用户信息
 */
function getUserInfo(that) {
  request.getUserInfo({
    success: function (data) {
      that.setData({
        avatar: data.avatar,
        about: data.about,
      });
    }
  });
}


/**
 * 更换头像1---选择头像
 */
function uploadPic(that) {
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
  getIconUpToken();

}

/**
 * 更换头像2---获取token
 * 
*/
function getIconUpToken() {
  tokenRequest.getIconUpToken({
    success: function (data) {
      token = data.iconUpToken;
      key = data.key;
    }
  });
}


/**
 * 更换头像3---上传头像到7牛
 */
function uploade2SevenNiu(that, newAvatar) {
  qiniuUploader.upload(newAvatar,
    (res) => {

      var newUrl = 'http://icon.polyphonytech.com/' + key;
      upDate(that,newUrl, false);
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
}


function up27niu(that, newAvatar){
  if (token && key) {
    uploade2SevenNiu(that, newAvatar);
  } else {
    tokenRequest.getIconUpToken({
      success: function (data) {
        token = data.iconUpToken;
        key = data.key;
        uploade2SevenNiu(that, newAvatar);
      }
    });
  }
}



/**
 * 更换头像4---更新用户信息
 */
function upDate(that, newUrl, about) {

  request.upDateUserInfo(newUrl, about, {
    success: function (data) {
      var app = getApp();
      app.globalData.changeUserInfo = true;
      wx.showToast({
        title: '保存成功',
      });
      that.setData({
        avatar: data.avatar,
        about: data.about,
      });
    }
  });
}


module.exports = {
  getUserInfo, uploadPic, up27niu, upDate
}