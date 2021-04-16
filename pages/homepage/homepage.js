// pages/homepage/homepage.js
const app = getApp()

Page({
  data: {
    tips: '',
    show: false,
    loaded: false,
    statusOk: false,
    statusBad: false,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    showDialog: false,
    longitude: 0, //地图界面中心的经度
    latitude: 0, //地图界面中心的纬度
    talonUserInfo: {
      avator: '',
      name: '',
      status: '',
      imgUrl: '',
      longitude: 0,
      latitude: 0,
      location: '',
      description: ''

    },
    imgArr:[
      "../files/sos.jpeg",
      "../files/sos.jpeg",
      "../files/sos.jpeg",
    ],
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

  messageUser(e) {
    let signedIn = this.data.signedIn
    if (signedIn) {
        // console.log("e messageUser from homepage", e)
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `/pages/chat_message/chat_message?id=${id}`,
        })
    } else {
      wx.switchTab({
        url: '/pages/patient/patient?id=${id}',
      })
      wx.showToast({
        title: 'Please sign in',
        duration: 1000,
        mask: true
      })
    }
  },

  updateCurrentUser(data, callback = null) {
    let page = this
    let id = app.globalData.userId; //localhost: 2
    // console.log("2nd id is", id)
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

    let id = app.globalData.userId; //localhost: 2
    // console.log("id is",id)

    let data = {
      role: 'patient',
      status: 'critical'
    }
    let callback = this.navigateToPatient(id)
    this.updateCurrentUser(data, callback)
  },

  refreshLocation() {
    let id = app.globalData.userId; //localhost: 2
    let data = {
      location: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
    }
    this.updateCurrentUser(data)
    // console.log("refreshed Location!")
    this.setMarkers()
    // console.log("markers refreshed!")
  },

  navigateToPatient(id) {
    wx.switchTab({
      url: `/pages/patient/patient?id=${id}`,
    })
  },

  userToMarker(user) {
    console.log({user})
    let marker = {
      id: user.id,
      name: user.wechat_account,
      status: user.status,
      avatarUrl: user.avatar,
      description: user.description,
      imgUrl: user.url,
      width: 30,
      height: 30 //keep to the ratio 2:1
    }
    // console.log("MARKER", marker)
    marker.iconPath = this.iconPathColor(marker.status)
    if (user.location) {
      marker.latitude = user.location.latitude
      marker.longitude = user.location.longitude
    }
    // console.log("marker is", marker)
    return marker
  },

  iconPathColor(status) {
    if (status === "healthy") {
      return '../files/icons/chillhelp.png'
    } else {
      return '../files/icons/sos.png'
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
  pressBad(e) {
    // console.log('=bindtapMap=', e),
    this.setData({
      statusBad: true,
      show: false
    })
  },

 pressOk(e) {
    // console.log('=bindtapMap=', e),
    this.setData({
      statusOk: true,
      show: false
    })
    let data = {stats: 'healthy'}
    this.updateCurrentUser(data)
  },

  confirmStatus(e) {
    // console.log('=bindtapMap=', e),
    this.setData({
      statusOk: false,
      statusBad: false
    })
  },

  getRoute(e) {
    // console.log("e:", e)
    let longitude = e.currentTarget.dataset.longitude
    let latitude = e.currentTarget.dataset.latitude
    let name = e.currentTarget.dataset.name
    // console.log("longitude:", longitude)
    // console.log("latitude:", latitude)
    // console.log("name", name)
    let plugin = requirePlugin('routePlan');
    let key = 'X6DBZ-J5NKU-OXRVY-4BGG6-6TRYZ-VMFUP'
    let referer = 'wxd203f2a6d5477bc9'
    let page = this
    // console.log("logs:", page.data.longitude)
    // let startPoint = JSON.stringify({  //起点
    //   'name': 'Current location',
    //   'latitude': page.data.latitude,
    //   'longitude': page.data.longitude
    // });
    let endPoint = JSON.stringify({  //终点
      'name': name,
      'latitude': latitude,
      'longitude': longitude,
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
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
    talonUserInfo.longitude = marker.longitude
    talonUserInfo.latitude = marker.latitude
    talonUserInfo.id = marker.id
    talonUserInfo.imgUrl = marker.imgUrl
    talonUserInfo.description = marker.description
    if (marker.imgUrl) {
      talonUserInfo.imgUrl = marker.imgUrl
    } else if (marker.status === "healthy") {
      talonUserInfo.imgUrl = "../files/HereToHelp.jpeg"
    } else {
      talonUserInfo.imgUrl = "../files/sos.jpeg"
    }
    // console.log(userInfo)
    this.setData({
      talonUserInfo,
      showDialog: !this.data.showDialog,
    })
  },

  preview(event) {
    // console.log("---------", event.currentTarget)
    // let currentUrl = event.currentTarget.dataset.src
    var imgArr = this.data.imgArr;
    wx.previewImage({
      // current: "../files/sos.jpeg", // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    })
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    // console.log('sign in clicked')
    let page = this
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log('res:', res)
        page.setData({
          userInfo: res.userInfo
        })
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync('userInfo', res.userInfo)
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
        // console.log("wxrequest completed")
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
  page.updateDbAvatarAndDescription
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
        // console.log("Storage get",res)
        this.setData({hasUserInfo: res.data})
      }
    })
  },

  onLoad: function (options) {
    let userInfo = app.globalData.globalUserInfo
    this.setData({
      userInfo,
    })
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        // console.log("Storage get",res)
        this.setData({userInfo: res.data})
      }
    })
    
    wx.stopPullDownRefresh()
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
        
      //   that.refreshLocation()   
      //   setInterval(function(){
      //     that.refreshLocation()
      // }, 30000)
      }
    })  
  },

showPosterPage() {
  this.setData({
    loaded: true,
    show: true
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
    page.checkSignedIn()
    page.setMarkers()
  },

  setMarkers(){
    let page = this
    let base = app.globalData.baseUrl;
    let markers = page.data.markers
    this.setHasUserInfo()
    wx.request({
      url: `${base}/users`,
      success(res) {
        // console.log("res", res)
        let users = res.data.users
        // console.log("users",users)
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
    var that = this;
    this.onLoad() //重新加载onLoad()
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