var util = require('../../utils/util.js')
var app = getApp()
var postRequest = require("../../request/PostRequest.js")
var offset=0

Page({
  data: {
    title: '如何让跳出“减负”怪圈？',
    data:'今日，对于孩子补习班的舆论越来越多，不少家长会发现，越来越多的补习班',
    send_article:[1,2,,3]
  },

  onShow: function(){
    var that=this;
    var token = wx.getStorageSync("token")
    postRequest.getPostById(offset,{
      success: function (data) {
        console.log(data);

        offset = data.offset;
        // loadMoreEnable = data.postList.length>=20;
        
        for(let i=0;i<data.postList.length;i++){
          var index=i;
          that.setData({
            items: data.postList,
          });         
          var src=data.postList[index].avatar;
          console.log(index,src)

        }
      }
    });
  },

  sendArticle:function(){
  	
  }
  
  

 
})
