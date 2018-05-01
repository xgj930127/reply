var util = require('../../utils/util.js')
var app = getApp()
var postRequest = require("../../request/PostRequest.js")
var offset=0

Page({
  data: {
    username: 'Danny Rice',
    profession:'英语教育专家',
    title:'如何让跳出“减负”怪圈？',
    article_list:[1,2,3],
    brief:'今日，对于孩子补习班',
    buttonText:'关注',
    open:true,
    src:'http://tvax2.sinaimg.cn/crop.144.35.355.355.180/006u8dduly8fp2vx0x5ilj30hs0hsmyz.jpg',
    ico_src:'../../image/icon01.png'
  },

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


  bindSaveTap: function(e){
      console.log(e)
  },

  cancalBtn:function(){
      var that=this;
      if(this.data.open){

        that.setData({
           buttonText:'已关注',
           open:false
        })
        open=false
      }else{
        that.setData({
           buttonText:'关注',
           open:true
        })
   
      }
      
      console.log(this.data.buttonText,this.data.open)
  }

   

})
