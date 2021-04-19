// pages/chat_index/chat_index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    messages: [],
    inputShowed: false,
    inputVal: "",
    useravator: ""
  },

  goToShow: function(e) {
    console.log("gotoshow", e)
    const id = e.currentTarget.dataset.id
    console.log("gotoshowidddd", id)
    wx.navigateTo({
      url: `/pages/chat_message/chat_message?id=${id}`,
    })
  },
  // ${id}
  search: function (value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([{text: '搜索结果', value: 1}, {text: '搜索结果2', value: 2}])
        }, 200)
    })
},
selectResult: function (e) {
    console.log('select result', e.detail)
},

onPullDownRefresh: function () {
  var that = this;
  that.onLoad() //重新加载onLoad()
},
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    let page = this
    let id = app.globalData.userId; //localhost: 2
    let base = app.globalData.baseUrl
    wx.request({
      url: `${base}/users/${id}/messages`,
      success(res) {
        console.log("message issss",res.data.messages)
        page.setData({
          messages: res.data.messages
        })
      }
    })
    this.setData({
      search: this.search.bind(this)
    })
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