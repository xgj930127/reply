
var url = require("../config.js").url;
var httpUtils = require("../utils/HttpUtils.js");

const KEY_USER_INFO = "USER_INFO";

/**
 * 获取用户信息
 */
function getUserInfo(resp) {

  httpUtils.request({
    url: url.getUserInfo,
    data: {},
    success: function (data) {
      wx.setStorageSync(KEY_USER_INFO, data)
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}


/**
 * 缓存获取用户信息
 */
function getUserInfoFromCache(resp) {
  var info = wx.getStorageSync(KEY_USER_INFO);
  if(info){
    if (resp) {
      resp.success(info);
    }
    return;
  }
  httpUtils.request({
    url: url.getUserInfo,
    data: {},
    success: function (data) {
      wx.setStorageSync(KEY_USER_INFO, data)
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}


/**
 * 更新用户信息
 */
function upDateUserInfo(avatar, about, resp) {
  var info = wx.getStorageSync(KEY_USER_INFO);
  httpUtils.request({
    url: url.update,
    data: {
      nickname: info.nickname ? info.nickname : '',
      avatar: avatar ? avatar : (info.avatar ? info.avatar : ''),
      gender: info.gender ? info.gender : 0,
      city: info.city ? info.city : '',
      province: info.province ? info.province : '',
      phone: info.phone ? info.phone : 0,
      age: info.age ? info.age : 0,
      about: about ? about : (info.about ? info.about : ''),
    },
    success: function (data) {
      wx.setStorageSync(KEY_USER_INFO, data)
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}



/**
 * 发起登录
 */
function login(resp) {
  //wx登陆
  wx.login({
    success: function (res) {
      if (res.code) {
        console.log(res);
        var code = res.code;
        //wx获取用户信息
        wx.getUserInfo({
          success: function (res) {
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            //注册/登陆逻辑
            loginRequest({
              code: code,
              nickName: nickName,
              avatar: avatarUrl,
              gender: gender,
              city: city,
              province: province
            }, {
                success: function (data) {
                  if (resp) {
                    resp.success(data);
                  }
                }
              });


          },
          //wx授权失败
          //注册/登陆逻辑
          fail: function ({ errMsg }) {
            //没有用户信息的登陆
            loginRequest({
              code: code,
              nickName: "",
              avatar: "",
              gender: "",
              city: "",
              province: ""
            }, {
                success: function (data) {
                  if (resp) {
                    resp.success(data);
                  }
                }
              });
            console.log(errMsg);
          }

        })
      }
    },
    //wx登陆失败
    fail: function ({ errMsg }) {
      httpUtils.showErrorToast(errMsg);
    }
  })
}



function loginRequest(data, resp) {

  httpUtils.request({
    url: url.loginUrl,
    data: data,
    success: function (data) {
      httpUtils.saveHttpHeader(data.userId, data.token);
      if (resp)
        resp.success(data);
    }
  }
  );
}


/**
 * 我的|他人的主页
 * 
 * otherUserId     我的主页传我的id|别人的主页传别人的id
 * offset   起始值
 * resp  回调
 */
function getMyPostList(otherUserId, offset, resp) {
  httpUtils.request({
    url: url.getMyPostList,
    data: {
      otherUserId: otherUserId,
      offset: offset
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
 * 分页获取我关注的人
 * 
 * startPosition   起始位置
 * userId
 * resp  回调
 */
function pageGetFollow(startPosition, userId, resp) {
  httpUtils.request({
    url: url.pageGetFollow,
    data: {
      startPosition: startPosition,
      userId: userId,
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
 * 分页获取我的粉丝
 * 
 * startPosition   起始位置
 * userId
 * resp  回调
 */
function pageGetFans(startPosition, userId, resp) {
  console.log(url.pageGetFans);
  httpUtils.request({
    url: url.pageGetFans,
    data: {
      startPosition: startPosition,
      userId: userId,
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
  login, getUserInfo, pageGetFollow, pageGetFans, getMyPostList, upDateUserInfo, getUserInfoFromCache
}
