var util = require('../../utils/util.js')
var app = getApp()
var tokenRequest = require('../../request/CommonRequest.js');
var qiniuUploader = require("../../utils/qiniuUploader.js");
var postRequest = require("../../request/PostRequest.js");

var imgArray = [];
var titleInput = "";
var postSucc = 0;
Page({
  data: {
    list: [
      //   // { widgetType: "img",video,
      //   //   imgSrc:""
      // index
      // imgUrl
      // videoSrc
      //videoUrl
      // 
      //   // },
      //   // { widgetType: "text",
      //   //   text:""
      //        index
      //       auto_height

      //   // },
    ],
    bottomText: "",//最后一个文本的内容
    isHiddenBottomTextarea: 0,//0隐藏最后一个输入框
    isHiddenTopTextarea: 1,//0是隐藏第一个输入框
    count: 0,
    showSend: true,
    showShare: false,

    TrunNum: 0,
    width: '',
    height: '',
    titleInput: ""
  },

  titleBindblur: function (e) {

    titleInput = e.detail.value;

  },
  onHide: function () {
    if (postSucc == 1) {
      //清除缓存
      
      postSucc = 0;
      var imgArray = [];
      var titleInput = "";
      this.setData({
        list: [],
        bottomText: "",//最后一个文本的内容
        isHiddenBottomTextarea: 0,//0隐藏最后一个输入框
        isHiddenTopTextarea: 1,//0是隐藏第一个输入框
        count: 0,
        showSend: true,
        showShare: false,
        TrunNum: 0,
        width: '',
        height: '',
        titleInput: "",
      });
    }
  },

  remove: function (e) {
    var that = this;
    var index = e.currentTarget.id;
    var list = that.data.list
    list.splice(index, 1)
    that.setData({
      list: list
    })

  },

  bindblur: function (e) {
    
    var isHiddenTopTextarea = 0;
    if (this.data.list.length > 0) {
      if (e.currentTarget.dataset.hi <= this.data.list.length - 1) {
        var lastModel = this.data.list[e.currentTarget.dataset.hi];
        lastModel.text = e.detail.value;
        return;
      }
    } else {
      isHiddenTopTextarea = 0;
    }
    var model = {
      widgetType: "text",
      text: e.detail.value,
      index: this.data.list.length,
      auto_height: false,
    };
    var list = this.data.list;
    this.data.list.push(model);
    this.setData({
      list: list,
      bottomText: "",
      isHiddenTopTextarea: isHiddenTopTextarea,
      isHiddenBottomTextarea: 0,
    });
    console.log(list)
  },

  //内容为空时清除输入框
  bindinput: function (e) {
    
    var that = this;
    if (e.detail.value == '') {
      var index = e.currentTarget.id;
      var list = that.data.list
      list.splice(index, 1)
      that.setData({
        list: list
      })
    }
  },

  /**
   * 更换图片
   */
  chooseImg: function (e) {
    
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {

        for (var i = 0; i < res.tempFilePaths.length; i++) {
          var model = {
            widgetType: "img",
            imgSrc: res.tempFilePaths[i],
            index: that.data.list.length,
            imgUrl: "",
          };
          var list = that.data.list;
          that.data.list.push(model);
        };
        for (var i = 0; i < that.data.list.length; i++) {
          var model = that.data.list[i];
          if (model.widgetType == "text") {
            model.auto_height = true;
          }
        };
        
        that.setData({
          list: list,
          isHiddenTopTextarea: 0,
          isHiddenBottomTextarea: 1
        });

      }
    });
  },
  //选择视频
  chooseVideo: function (e) {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var model = {
          widgetType: "video",
          index: that.data.list.length,
          videoSrc: res.tempFilePath,
          videoUrl: "",
        };
        var list = that.data.list;
        that.data.list.push(model);
        that.setData({
          list: list,
          isHiddenTopTextarea: 0,
          isHiddenBottomTextarea: 1
        });

      }
    })
  },
  //发帖
  sendBtn: function (e) {
    if (titleInput.length == 0) {
      wx.showToast({
        title: "请输入标题",
        icon: "none",
        duration: 2000
      });
      return;
    }
    if (this.data.list.length == 0) {
      wx.showToast({
        title: "请输入内容",
        icon: "none",
        duration: 2000
      });
      return;
    }
    wx.showLoading({
      mask: true,
    })
    this.getEveryImg();
    // postRequest
  },
  //递归去上传七牛
  getEveryImg: function () {
    for (var i = 0; i < this.data.list.length; i++) {
      var model = this.data.list[i];
      if (model.widgetType == "img" || model.widgetType == "video") {
        imgArray.push(model);
      }
    }
    if (imgArray.length > 0) {
      this.saveToqiniu(imgArray[0]);
    } else {
      this.postRequest();
    }
  },
  //获取token

  saveToqiniu: function (model) {
    var that = this;
    if (model.widgetType == "img") {
      tokenRequest.getIconUpToken({
        success: function (data) {
          that.uploade2SevenNiu(model.imgSrc, data.iconUpToken, data.key, model.index);
          wx.showLoading({
            mask: true,
          });
        }
      })
    } else {
      tokenRequest.getVideoUpToken({
        success: function (data) {
          that.uploade2SevenNiu(model.videoSrc, data.videoUpToken, data.key, model.index);
          wx.showLoading({
            mask: true,
          });
        }
      })
    };

  },
  /**
   * 更换头像3---上传头像到7牛
   */
  uploade2SevenNiu: function (newAvatar, token, key, index) {
    var that = this;

    qiniuUploader.upload(newAvatar,
      (res) => {
        var newModel = that.data.list[index];
        if (newModel.widgetType == "img") {
          var newUrl = 'http://icon.polyphonytech.com/' + key;
          newModel.imgUrl = newUrl;

        } else {
          var newUrl = 'http://video.polyphonytech.com/' + key;
          newModel.videoUrl = newUrl;

        };

        imgArray.shift();
        if (imgArray.length > 0) {
          that.saveToqiniu(imgArray[0]);
        } else {
          that.postRequest();
        }
      },
      (error) => {
        wx.showToast({
          title: "发帖失败，请重试",
          icon: "none",
          duration: 2000
        });
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
  postRequest: function () {
    var listToStr = JSON.stringify(this.data.list);
    var that = this;
    postRequest.addPost(titleInput, listToStr, {
      success: function (data) {
        wx.showToast({
          title: "发帖成功",
          icon: "none",
          duration: 2000
        });
        postSucc = 1;
        app.globalData.userSendNewPost = true;
        console.log(that.data.list)
        that.setData({
          showSend: false,
          showShare: true,

        });
      }
    })
  },

  addBtn: function () {

    var animation1 = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: 'ease-in-out',
    })

    var animation2 = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: 'ease-in-out',
    })

    var animation3 = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: 'ease-in-out',
    })

    // var {animation1,animation2,animation3}={animation,animation,animation}
    this.animation1 = animation1
    this.animation2 = animation2
    this.animation3 = animation3

    this.data.count++;

    this.setData({
      count: this.data.count++,
    })


    if (this.data.count % 2) {

      setTimeout(function () {
        animation1.translate(-50, -36).rotate(360).step()
        animation2.translate(-50, 36).rotate(360).step()
        animation3.rotate(0).step()
        this.setData({
          animationData: animation1.export(),
          animationData2: animation2.export(),
          animationRotate: animation3.export()
        })
      }.bind(this), 100)
    } else {

      setTimeout(function () {
        animation1.translate(0, 0).rotate(0).step()
        animation2.translate(0, 0).rotate(0).step()
        animation3.rotate(45).step()
        this.setData({
          animationData: animation1.export(),
          animationData2: animation2.export(),
          animationRotate: animation3.export()
        })
      }.bind(this), 100)

    }


  },

  onShareAppMessage: function (options) {
    var that = this;
    var shareObj = {
      title: '点赞生活秀',
      desc: '点赞生活秀!',
      path: '/page/index/index',
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function (res) {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    };

    // 来自页面内的按钮的转发

    　　if (options.from == 'button') {
      　　　　var eData = options.target.dataset;
      var num = that.data.TrunNum++;
      console.log(num);
      　　　　postRequest.getUpdateTrunNum(num, {
        success: function (data) {
          console.log(data)
          that.setData({
            TrunNum: num
          })
        }
      })


    };

    return shareObj;


  }



})
