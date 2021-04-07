// pages/homepage/homepage.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    showDialog: false,
    longitude: 113.14278, //地图界面中心的经度
    latitude: 23.02882, //地图界面中心的纬度
    talonUserInfo: {
      name: '',
      status: ''
    },
    markers: [ //标志点的位置
      //位置1
      {
        id: 1,
        // callout: {
        //   content: "fuck this",
        //   fontSize: 20,
        //   padding: 20,
        // },
        name: "Desmond",
        iconPath: '/testpins/Talon-red-pin.png',
        status: "critical",
        latitude: 22.524689,
        longitude: 113.937271,
        width: 24,
        height: 28
      },
      //位置2
      {
        id: 2,
        // iconPath: "images1.jpeg",
        // callout: {
        //   content: "fuck this",
        //   fontSize: 20,
        //   padding: 40
        // },
        name: "Kevin",
        role: 'medic',
        status: "non-critical",
        image: '',
        iconPath: "/testpins/Talon-orange-pin.png",
        latitude: 22.522807,
        longitude: 113.935338,
        width: 24,
        height: 28
      },
      //位置3
      {
        id: 3,
        name: "Marshall",
        status: "healthy",
        iconPath: '/testpins/Talon-blue-pin.png',
        // iconPath: "images1.jpeg",
        latitude: 22.53535,
        longitude: 113.920322,
        width: 24,
        height: 28
      },

    ]
  },

  goToPatient: function(event){
    const id = 5
    // I put id = 5 as we don't have the login, this ID will be changed by the currentUser.id (the one who has logged in)
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

  bindregionchange(e) {
    console.log('=bindregiοnchange=', e)
  },

  bindtapMap(e) {
    console.log('=bindtapMap=', e),
    this.setData({
      showDialog: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  markertap(e) {
    console.log("markertap:", e)
    var id = e.detail.markerId
    console.log('id:', id)
    // var name = this.data.markers[id - 1].name
    // console.log("name:", name)
    let userInfo = this.data.talonUserInfo
    userInfo.name = this.data.markers[id - 1].name
    userInfo.status = this.data.markers[id - 1].status
    // console.log(userInfo)
    this.setData({
      // lingyuanName: name,
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

  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

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
    wx.request({
      url: `${base}/users`,
      success(res) {
        // console.log("res", res)
        let users = res.data.users
        let markers = users.map((user) => {
          // console.log("user is", user)
          return page.userToMarker(user)
        })
        console.log(markers)
        page.setData({markers})
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