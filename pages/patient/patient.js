const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
      src: '../files/alarm.mp3',
      alarm: false,
      user: {},
      currentUser: {}
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
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths
      }
    })      
  },
  error(e) {
    console.log(e.detail)
  },

  updateCritical(e){
    console.log(e)
    let page = this
    let status = page.data.currentUser.status = 'non-critical'
    let id = e.currentTarget.dataset.id.id
    let base = app.globalData.baseUrl
    page.setData({status})
    let data = e.currentTarget.dataset.id
    wx.request({
      url: `${base}/users/${id}`,
      method: 'PUT',
      data, 
      success(res){
        console.log(res)
      }
    })
  },

  updateNonCritical() {
    let page = this
    let status = page.data.currentUser.status = 'critical'
    page.setData({status})
    console.log(page.data.currentUser.status)
  },

  onLoad: function (user) {
    this.ctx = wx.createCameraContext()
    this.setData({user})
  },

  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
  }, 

  onShow: function () {
    let page = this
    let base = app.globalData.baseUrl
    let user = page.data.user
    wx.request({
      url: `${base}/users/${user.id}`,
      success(res) {
        const currentUser = res.data;
        page.setData({currentUser})
        console.log(currentUser)
      }
    })
  }
})