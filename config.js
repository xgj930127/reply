/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

// var host = "http://192.168.203.250/"
var host ="https://api.polyphonytech.com/";


var isDebug=true;
var url = {
  host,
  //1.1 第三方微信小程序注册/登录
  loginUrl: `${host}sso/member/weixin`,
  //1.2 获取用户个人信息
  getUserInfo: `${host}wireless/account/userInfo`,
  //1.3 编辑用户信息
  update: `${host}wireless/account/update`,
  //1.4 上传用户头像到七牛(获取七牛的token,然后上传文件)
  getIconUpToken: `${host}wireless/account/getIconUpToken`,
  //1.5 上传视频获取token
  getVideoUpToken:`${host}wireless/account/getVideoUpToken`,


  //2.2 发帖
  addPost:`${host}wireless/post/addPost`,
  //2.3 删除帖子
  delPostById:`${host}wireless/post/delPostById`,

  //2.4 添加评论
  addComment:`${host}wireless/post/addComment`,
  //2.5 删除评论
  delCommentById:`${host}wireless/post/delCommentById`,

  //2.6 添加回复
  addReplay:`${host}wireless/post/addReplay`,
  //2.7 删除回复
  delReplayById:`${host}wireless/post/delReplayById`,

  //2.8 我的|他人的主页
  getMyPostList: `${host}wireless/post/getMyPostList`,

  //2.9 点赞|取消点赞
  addOrDelPraise:`${host}wireless/post/addOrDelPraise`,

  //2.10 修改转发数
  getUpdateTrunNum:`${host}wireless/post/getUpdateTrunNum`,

  //2.11 推荐接口
  getPostList: `${host}wireless/post/getPostList`,
  //2.12 帖子详情接口
  getPostById:`${host}wireless/post/getPostById`,
  //2.13 评论详情接口
  getCommentListById: `${host}wireless/post/getCommentListById`,
  //2.14 评论下面的回复
  getReplayListByCommentId: `${host}wireless/post/getReplayListByCommentId`,

  //3.1 关注
  addFollow: `${host}wireless/follow/addFollow/`,
  //3.2 取消关注
  cancelFollow: `${host}wireless/follow/cancelFollow/`,
  //3.3 分页获取我关注的人
  pageGetFollow: `${host}wireless/follow/pageGetFollow`,
  
  //3.4 分页获取我的粉丝
  pageGetFans: `${host}wireless/follow/pageGetFans`,
};

module.exports = { url, isDebug}
