App({

  login: function () {
    const host = this.globalData.baseUrl
    // console.log('beginning login')
    wx.login({
      success: (res) => {
        // console.log(res)
        wx.request({
          url: host + '/login',
          method: 'post',
          data: {
            code: res.code
          },
          success: (res) => {
            console.log(res)
            this.globalData.userId = res.data.userId
            console.log("login successful, user ID is:", this.globalData)

            wx.setStorageSync('hasUserInfo', res.data.hasUserInfo)
            wx.setStorageSync('currentUser', res.data.currentUser)
          }
        })
      }
    })

  },
  onLaunch: function () {
    // checking if the user is in Storage
    let user = wx.getStorageSync('currentUser')
    if (user) {
      console.log('user is in the storage')
      this.globalData.userId = user.id
    } else {
      this.login()
    }

  },
  onLaunch: function () {
    // checking if the user is in Storage
    let user = wx.getStorageSync('currentUser')
    if (user) {
      console.log('user is in the storage')
      this.globalData.userId = user.id
    } else {
      this.login()
    }
  },
  globalData: {
    // userInfo: null,
    baseUrl: 'http://localhost:3000/api/v1'
    //baseUrl: 'https://t-a-l-o-n.herokuapp.com/api/v1'
  },
})