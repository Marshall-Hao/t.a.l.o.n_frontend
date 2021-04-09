// pages/homepage/homepage.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    showDialog: false,
    
    longitude: 0, //地图界面中心的经度
    latitude: 0, //地图界面中心的纬度
    talonUserInfo: {
      name: '',
      status: '',
      imgUrl: ''
    },
    markers: []
  },

  updateCurrentUser(data, callback = null) {
    let page = this
    let id = app.globalData.userId;
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

  goToPatient: function (event) {
    let id = app.globalData.userId;
    let data = {
      role: 'patient',
      status: 'critical'
    }
    let callback = this.navigateToPatient
    this.updateCurrentUser(data, callback)
  },

  refreshLocation() {
    let id = app.globalData.userId;
    let data = {
      location: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
    }
    this.updateCurrentUser(data)
    console.log("refreshed Location!")
  },

  navigateToPatient(id) {
    wx.navigateTo({
      url: `/pages/patient/patient?id=${id}`,
    })
  },

  userToMarker(user) {
    // console.log(user)
    let marker = {
      id: user.id,
      name: user.wechat_account,
      status: user.status,
      latitude: user.location.latitude,
      longitude: user.location.longitude,
      imgUrl: user.url,
      width: 24,
      height: 36
    }
    console.log("MARKER", marker)
    marker.iconPath = this.iconPathColor(marker.status)
    // console.log("marker is", marker)
    return marker
  },

  iconPathColor(status) {
    if (status === "healthy") {
      return '/testpins/Talon-blue-pin.png'
    } else if (status === "critical") {
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
  /**
   * 生命周期函数--监听页面加载
   */
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
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log('res:', res)
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
      this.updateCurrentUser(data)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
},
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  setHasUserInfo(){
    // console.log('setting from storage')
    wx.getStorage({
      key: 'hasUserInfo',
      success: (res) => {
        console.log("Storage get",res)
        this.setData({hasUserInfo: res.data})
      }
    })
  },

setHasUserInfo(){
  wx.getStorage({
    key: 'hasUserInfo',
    success: (res) => {
      this.setData({hasUserInfo: res.data})
    }
  })
},

  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    // console.log("onLoad function"); 
    }
    var that = this;
    wx.getLocation({
      type: "wgs84",
      isHighAccuracy: true,
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        // console.log("当前位置的经纬度为：", res.latitude, res.longitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        if (longitude !== 0) setTimeout(that.showPosterPage, 2600);
        that.refreshLocation()   
        setInterval(function(){
          that.refreshLocation()
      }, 2000)
      }
    })  
  },

showPosterPage() {
  this.setData({
    loaded: true
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let page = this;
    let base = app.globalData.baseUrl;
    let markers = page.data.markers
    this.setHasUserInfo()
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
        // console.log(markers)
        page.setData({
          markers
        })
        // page.data.markers.push(res.data.users)
        // console.log(markers)
        
      }
    })
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})