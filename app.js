// app.js
App({
  // onLaunch() {
  //   // 展示本地存储能力
  //   const logs = wx.getStorageSync('logs') || []
  //   logs.unshift(Date.now())
  //   wx.setStorageSync('logs', logs)

  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //     }
  //   })
  // },
  onLaunch: function () {
    const host = this.globalData.baseUrl
    console.log('host is :', host)
    console.log('beginning login')
    wx.login({
      success: (res) => {
        console.log(res)
        wx.request({
          url: host + '/login',
          method: 'post',
          data: {
            code: res.code
          },
          success: (res) => {
            console.log(res)
            this.globalData.userId = res.data.userId
          }
        // insert next code here
        })
      }
    })
  },
  globalData: {
    // userInfo: null,
    baseUrl: 'http://localhost:3000/api/v1'
  }
})
