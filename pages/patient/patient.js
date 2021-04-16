const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {
      src: 'https://project-lw.oss-cn-shenzhen.aliyuncs.com/bell_sound_effect.mp3?versionId=CAEQHBiBgMDWjt3UxRciIDdiZDBjM2Q1YzZiNDRiMGI5ZWZmNTM2MmI1YTYxNDFl',
      alarm: false,
      user: {},
      currentUser: {},
      longitude: 0, //地图界面中心的经度
      latitude: 0, //地图界面中心的纬度
      talonUserInfo: {
        name: '',
        status: '',
        imgUrl: ''
      },
      markers: []
  },

  checkSignedIn(){
    // console.log('setting from storage')
    wx.getStorage({
      key: 'hasUserInfo',
      success: (res) => {
        // console.log("Storage get",res)
        this.setData({hasUserInfo: res.data})
      }
    })
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        // console.log("Storage get",res)
        this.setData({userInfo: res.data})
      }
    })
    wx.getStorage({
      key: 'signedIn',
      success: (res) => {
        // console.log("Storage get",res)
        this.setData({signedIn: res.data})
      }
    })
  },

  updateCurrentUser(data, callback = null) {
    let page = this
    let id = app.globalData.userId;
    console.log("2nd id is", id)
    let base = app.globalData.baseUrl
    // console.log("callback:!", callback)
    wx.request({
      url: `${base}/users/${id}`,
      method: 'PUT',
      data,
      success(res) {
      if (callback)  callback(id)
      }
    })
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    console.log('sign in clicked')
    let page = this
    page.setData({
      signedIn: true
    })
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log('res:', res)
        page.setData({
          userInfo: res.userInfo
        })
        app.globalData.userInfo = res.userInfo
        app.globalData.hasUserInfo = true
        app.globalData.signedIn = true
        wx.setStorageSync('userInfo', res.userInfo)
        wx.setStorageSync('signedIn', true)

        let wechatAccountNickname = res.userInfo.nickName
        let longitude = this.data.longitude
        let latitude = this.data.latitude
        let data = {
          wechat_account: wechatAccountNickname,
          location: {
            latitude: latitude,
            longitude: longitude
          },
        }
        console.log("wxrequest completed")
      this.updateCurrentUser(data)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo
        app.globalData.hasUserInfo = true
        let currentUser = wx.getStorage({
          key: 'currentUser',
        })
        currentUser.wechat_account = wechatAccountNickname
        currentUser.location = {
          latitude,
          longitude,
        }
      }
    })
},



  // goToHomepage() {
  //   wx.navigateTo({
  //     url: '/pages/homepage/homepage',
  //   })
  // }, 

  updateCurrentUser(currentUser) {
    let page = this
    let id = page.data.currentUser.id
    console.log(id)
    let base = app.globalData.baseUrl
    let data = page.data.currentUser
    console.log(data)
    wx.request({
      url: `${base}/users/${id}`,
      method: 'PUT',
      data,
      success(res){
        console.log(res)
        page.setData({currentUser: data})
      }
    })
  },
  audioPlay: function (e) {
    let page = this 
    let alarm = page.data.alarm = true;
    page.setData({alarm})
    page.audioCtx.play()
  },
  audioPause: function (e) {
    let page = this
    let alarm = page.data.alarm = false;
    page.setData({alarm})
    page.audioCtx.pause()
  },
  takePhoto() {
    let page = this
    let id = page.data.currentUser.id
    console.log("this page id is", id)
    let baseurl = app.globalData.baseUrl
    // console.log(baseurl)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // console.log('chooseImage',res)
        const tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: `${baseurl}/users/${id}/update_photo`, //真实的接口地址
          filePath: tempFilePaths,
          name: 'photo',
          formData: {
            'user': 'test'
          },
          success (res){
            console.log("url res is", res)
            const data = res.data
            console.log(data)
            wx.showToast({
              title: 'Got Ya',
              icon: 'success',
              duration: 2000
            })
            //do something
          }
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  updateCritical(){
    let page = this
    let status = page.data.currentUser.status = 'non-critical'
    let currentUser = page.data.currentUser
    page.setData({status})
    console.log('Current user', page.data.currentUser.status)
    return page.updateCurrentUser(currentUser)
  },
  updateNonCritical() {
    let page = this
    let status = page.data.currentUser.status = 'critical'
    let currentUser = page.data.currentUser
    page.setData({status})
    console.log('Current user', page.data.currentUser.status)
    return page.updateCurrentUser(currentUser)
  },

  onLoad: function (user) {
  },

  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  onShow: function () {
    let page = this
    page.checkSignedIn()
    let hasUserInfo = app.globalData.hasUserInfo
    page.setData({
      hasUserInfo,
    })
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        // console.log("Storage get",res)
        page.setData({userInfo: res.data})
        app.globalData.globalUserInfo = res.data
      }
    })
    let currentUser = wx.getStorageSync('currentUser')
    console.log({currentUser})
    page.setData({currentUser})
    
    page.ctx = wx.createCameraContext()
    // page.setData({user})
    // var that = this;
    // wx.getLocation({
    //   type: "wgs84",
    //   isHighAccuracy: true,
    //   success: function (res) {
    //     var latitude = res.latitude;
    //     var longitude = res.longitude;
    //     console.log("当前位置的经纬度为：", res.latitude, res.longitude);
    //     that.setData({
    //       latitude: res.latitude,
    //       longitude: res.longitude,
    //     })
    //   }
    // })
    // let page = this
    // console.log(111, page.options)
    // page.ctx = wx.createCameraContext()
    // page.setData({user})
    // var that = this;
    // wx.getLocation({
    //   type: "wgs84",
    //   isHighAccuracy: true,
    //   success: function (res) {
    //     var latitude = res.latitude;
    //     var longitude = res.longitude;
    //     console.log("当前位置的经纬度为：", res.latitude, res.longitude);
    //     that.setData({
    //       latitude: res.latitude,
    //       longitude: res.longitude,
    //     })
    //   }
    // })
    // let page = this
    // let base = app.globalData.baseUrl
    // let markers = page.data.markers
    // let user = page.data.user
    // console.log("user",user)
    // wx.request({
    //   url: `${base}/users/${user.id}`,
    //   success(res) {
    //     const currentUser = res.data;
    //     page.setData({currentUser})
    //     console.log(currentUser)
    //   }
    // })
    // wx.request({
    //   url: `${base}/users`,
    //   success(res) {
    //     // console.log("res", res)
    //     let users = res.data.users
    //     console.log("users",users)
    //     let markers = users.map((user) => {
    //       // console.log("user is", user)
    //       return page.userToMarker(user)
    //     })
    //     markers = markers.filter(marker => marker.hasOwnProperty("latitude"))
    //     // console.log(markers)
    //     page.setData({
    //       markers
    //     })
    //     // page.data.markers.push(res.data.users)
    //     // console.log(markers)
        
    //   }
    // })
  }
})