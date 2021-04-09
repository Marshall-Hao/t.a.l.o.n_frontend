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
      longitude: 0, //地图界面中心的经度
      latitude: 0, //地图界面中心的纬度
      talonUserInfo: {
        name: '',
        status: '',
        imgUrl: ''
      },
      markers: []
  },

  goToHomepage() {
    wx.navigateTo({
      url: '/pages/homepage/homepage',
    })
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
      width: 24,
      height: 28
    }
    marker.iconPath = this.iconPathColor(marker.status)
    if (user.location) {
      marker.latitude = user.location.latitude
      marker.longitude = user.location.longitude
    }
    console.log("patient marker is", marker)
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
  bindregionchange(e) {
    // console.log('=bindregiοnchange=', e)
  },

  bindtapMap(e) {
    // console.log('=bindtapMap=', e),
    this.setData({
      showDialog: false,
    })
  },

  markertap(e) {
    // console.log("markertap:", e)
    var id = e.detail.markerId
    // console.log('id:', id)
    // var name = this.data.markers[id - 1].name
    // console.log("name:", name)
    let talonUserInfo = this.data.talonUserInfo
    let marker = this.data.markers.find((marker) => {
      return marker.id === id
    })
    talonUserInfo.name = marker.name
    talonUserInfo.status = marker.status
    talonUserInfo.imgUrl = marker.imgUrl
    // console.log(userInfo)
    this.setData({
      talonUserInfo,
      showDialog: !this.data.showDialog,
    })
  },

  onLoad: function (user) {
    let page = this
    page.ctx = wx.createCameraContext()
    page.setData({user})
    var that = this;
    wx.getLocation({
      type: "wgs84",
      isHighAccuracy: true,
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
    let markers = page.data.markers
    let user = page.data.user
    wx.request({
      url: `${base}/users/${user.id}`,
      success(res) {
        const currentUser = res.data;
        page.setData({currentUser})
        console.log(currentUser)
      }
    })
    wx.request({
      url: `${base}/users`,
      success(res) {
        // console.log("res", res)
        let users = res.data.users
        console.log("users",users)
        let markers = users.map((user) => {
          // console.log("user is", user)
          return page.userToMarker(user)
        })
        markers = markers.filter(marker => marker.hasOwnProperty("latitude"))
        // console.log(markers)
        page.setData({
          markers
        })
        // page.data.markers.push(res.data.users)
        // console.log(markers)
        
      }
    })
  }
})