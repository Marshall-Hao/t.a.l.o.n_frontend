const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
      src: '../files/alarm.mp3',
      alarm: false,
      user: {}
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

  updateCritical(){
    let page = this
    let status = page.data.status = 'non-critical'
    page.setData({status})
    console.log(status)
  },

  updateNonCritical() {
    let page = this
    let status = page.data.status = 'critical'
    page.setData({status})
  },

  onLoad(user) {
    this.ctx = wx.createCameraContext()
    this.setData({user})
  },

  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
  }, 

  onShow: function () {
    let page = this
    let base = app.globalData.baseUrl
    let user = page.user
    wx.request({
      url: `${base}/stories/${user.id}`,
    })
  }
})