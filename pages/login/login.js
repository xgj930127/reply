var app = getApp()
var feedbackApi = require('../../utils/showToast.js') //引入消息提醒暴露的接口  
Page({
    data: {
        user: '',
        password: '',
        openid:''
    },
    listenerUserInput: function(e) {
        this.data.user = e.detail.value

    },
    listenerPasswordInput: function(e) {
        this.data.password = e.detail.value
    },
    callPhone: function() { //客服
        wx.makePhoneCall({
            phoneNumber: '010-62559142'
        })
    },
    onShow: function() {
        console.log('再次清理缓存')
        wx.clearStorage()
    },
    btnLogin: function() {
        var user = this.data.user.trim()
        var password = this.data.password.trim()
        var code,openId,nickName,avatar,gender,city,openId
        if (!user) {
            feedbackApi.showToast({
                title: '请输入账户名称',
                mask: false
            })
        } else if (!password) {
            feedbackApi.showToast({
                title: '请输入登录密码',
                mask: false
            })
        } else {
            console.log('user:' + user)
            console.log('passwd:' + password)
            wx.request({
                url: 'https://192.168.203.250/wireless/post/addPost',
                data: {
                    user:user,
                    password:password,
                    openId:openId,
                    code:code,
                    nickName:nickName,
                    avatar:avatar,
                    gender:gender,
                    city:city
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded" 
                },
                success: function(res) {
                    console.log('success')
                    console.log(res.data)
                    console.log('res.data.no:' + res.data.no)
                    var tipsTitle = res.data.msg
                    if (res.data.no == 0) {
                        var token = res.data.data.token
                        wx.setStorageSync("token", token)
                        wx.setStorageSync("uname", user)
                        feedbackApi.showToast({
                            title: '登录成功',
                            mask: false,
                            callback: function() {
                                wx.switchTab({
                                    url: '../login/login',
                                    success: function() {}
                                })
                            }
                        })
                    } else {
                        feedbackApi.showToast({
                            title: tipsTitle,
                            mask: false
                        })
                    }

                },
                fail: function(error) {
                    feedbackApi.showToast({
                        title: '系统繁忙，请稍后重试',
                        mask: false
                    })
                    console.log('httpsfail')
                    console.log(error)
                },
                complete: function() {}
            })

        }
    }
});