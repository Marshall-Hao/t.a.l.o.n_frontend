const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {
      src: '../files/alarm.mp3',
      alarm: false,
      user: {},
      currentUser: {},
      longitude: 113.14278, //地图界面中心的经度
      latitude: 23.02882, //地图界面中心的纬度
      markers: [ //标志点的位置
        //位置1
        {
          id: 1,
          name: "Desmond",
          iconPath: '/testpins/Talon-red-pin.png',
          status: "critical",
          latitude: 22.524689,
          longitude: 113.937271,
          width: 24,
          height: 48 //keep to the ratio 2:1
        },
        //位置2
        {
          id: 2,
          name: "Kevin",
          role: 'medic',
          status: "non-critical",
          image: '',
          iconPath: "/testpins/Talon-orange-pin.png",
          latitude: 22.522807,
          longitude: 113.935338,
          width: 24,
          height: 48 //keep to the ratio 2:1
        },
        //位置3
        {
          id: 3,
          name: "Marshall",
          status: "healthy",
          iconPath: '/testpins/Talon-blue-pin.png',
          latitude: 22.53535,
          longitude: 113.920322,
          width: 24,
          height: 48 //keep to the ratio 2:1
        },
      ]
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
    let page = this
    let id = page.data.currentUser.id
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
          url: `${baseurl}/users/${id}/update_photo`, //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'photo',
          formData: {
            'user': 'test'
          },
          success (res){
            const data = res.data
            console.log(data)
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
  userToMarker(user) {
    // console.log(user)
    let marker = {
      id: user.id,
      name: user.wechat_account,
      status: user.status,
      latitude: user.location.latitude,
      longitude: user.location.longitude,
      width: 24,
      height: 28
    }
    marker.iconPath = this.iconPathColor(marker.status)
    // console.log("marker is", marker)
    return marker
  },
  iconPathColor(status) {
    if (status=== "healthy") {
      return '/testpins/Talon-blue-pin.png'}
    else if (status === "critical") {
      return '/testpins/Talon-red-pin.png'
    } else {
      return '/testpins/Talon-orange-pin.png'
    }
  },
  onLoad: function (user) {
    let page = this
    page.ctx = wx.createCameraContext()
    page.setData({user})
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log("当前位置的经纬度为：", res.latitude, res.longitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })
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