// pages/homepage/homepage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    longitude: 113.14278, //地图界面中心的经度
    latitude: 23.02882, //地图界面中心的纬度
    userInfo: {
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
    let userInfo = this.data.userInfo
    userInfo.name = this.data.markers[id - 1].name
    userInfo.status = this.data.markers[id - 1].status
    console.log(userInfo)
    this.setData({
      // lingyuanName: name,
      userInfo,
      showDialog: !this.data.showDialog,
    })
  },

  onLoad: function (options) {
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