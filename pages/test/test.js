// pages/test/test.js
Page({

  /**
   * Page initial data
   */
  data: {
    latitude: 0,
    longitude: 0

  },

  getRoute() {
    let plugin = requirePlugin('routePlan');
    let key = 'X6DBZ-J5NKU-OXRVY-4BGG6-6TRYZ-VMFUP'
    let referer = 'wxb858e28accf918d9'
    let page = this
    console.log("logs:", page.data.longitude)
    let startPoint = JSON.stringify({  //起点
      'name': 'Current location',
      'latitude': page.data.latitude,
      'longitude': page.data.longitude
    });
    let endPoint = JSON.stringify({  //终点
      'name': '北京西站',
      'latitude': 39.894806,
      'longitude': 116.321592
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&startPoint=' + startPoint
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let page = this
    wx.getLocation({
      type: "wgs84",
      isHighAccuracy: true,
      success: function (res) {
        // console.log("当前位置的经纬度为：", res.latitude, res.longitude);
        page.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })  
  },

  // https://api.weixin.qq.com/wxa/servicemarket?access_token=ACCESS_TOKEN

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})