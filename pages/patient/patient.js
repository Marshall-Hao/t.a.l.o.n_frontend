const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {
      descriptionDialog: false,
      description: '',
      src: 'https://project-lw.oss-cn-shenzhen.aliyuncs.com/bell_sound_effect.mp3?versionId=CAEQHBiBgMDWjt3UxRciIDdiZDBjM2Q1YzZiNDRiMGI5ZWZmNTM2MmI1YTYxNDFl',
      alarm: false,
      user: {},
      currentUser: {},
      longitude: 0, //地图界面中心的经度
      latitude: 0, //地图界面中心的纬度
  },

  writeDescription(){
    this.setData({
      descriptionDialog: true
    })
  },

  submitDescription(e){
    // console.log("submit data:", e.detail.value)
    let page = this
    let description = e.detail.value.content
    page.setData({
      description,
      descriptionDialog: false
    })
    page.updateDbAvatarAndDescription()
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
        // this.updateCurrentUser(data)
        this.updateDbAvatarAndDescription()
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

loginOut() {
  let page = this
  page.setData ({
    signedIn: false
  })
},

  updateCurrentUser(currentUser) {
    // console.log(123456)
    let page = this
    let id = page.data.currentUser.id //localhost: 2/4
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

  updateDbAvatarAndDescription(){
    let page = this
    let wechat_account = page.data.userInfo.nickName
    let avatar = page.data.userInfo.avatarUrl
    let description = page.data.description;
    let base = app.globalData.baseUrl;
    let id = app.globalData.userId; //localhost: 2/4
    let body = {
      wechat_account: wechat_account,
      avatar: avatar,
      description: description
    }
    console.log({body})
    wx.request({
      url: `${base}/users/${id}`,
      method: 'PUT',
      data: {
        user: body
      },
      success(res) {
        console.log({res})
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
 
  updateSwitch(e) {
    console.log("switch is:", e)
    let page = this
    // let status = page.data.currentUser.status
    // let currentUser = page.data.currentUser
    let switchend = page.data.switchend = !page.data.switchend
    page.setData({
      switchend
    })
    // console.log('Current user', page.data.currentUser.status)
   page.updateCritical()
  },
  
  onPullDownRefresh: function () {
    var that = this;
    this.onLoad() //重新加载onLoad()
  },

  switchToStatus(switchend) {
    if (switchend) {
      return "healthy"
    } else {
      return "critical"
    }
  },

  statusToSwitch(status) {
    if ( status === "healthy") {
      return true
    } else {
      return false
    }
  },

  updateCritical() {
    let page = this
    let currentUser = page.data.currentUser
    let switchend = page.data.switchend
    let status = page.data.currentUser.status = page.switchToStatus(switchend)
    page.setData({status})
    console.log('Current user', page.data.currentUser.status)
    return page.updateCurrentUser(currentUser)
  },

  goToAbout() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  onLoad: function (user) {
    // let status = page.data.currentUser.status
    // let switchend = page.data.switchend = page.statusToSwitch(status)
    wx.stopPullDownRefresh()
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
    let status = page.data.currentUser.status
    let switchend = page.data.switchend = page.statusToSwitch(status)
    page.ctx = wx.createCameraContext()
  }
})