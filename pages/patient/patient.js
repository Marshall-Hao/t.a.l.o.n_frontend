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
    let page = this
    page.ctx = wx.createCameraContext()
    page.setData({user})
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