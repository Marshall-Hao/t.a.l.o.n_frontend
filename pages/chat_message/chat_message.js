// pages/chat_message/chat_message.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    current_user_id: 0,
    options: 0,
    messages: [],
    message: null
  },


  send(e) {
    // console.log("submit e:", e)
    console.log("submit data:", e.detail.value)
    let page = this
    let user_id = app.globalData.userId; //localhost: 2
    let base = app.globalData.baseUrl
    let receiver_id = page.data.options.id //localhost: 4
    let content = e.detail.value
    // { message: {content: 'test'} }
    if (content.content.length > 0) {
      wx.request({
        url: `${base}/users/${user_id}/messages/?receiver_id=${receiver_id}`,
        method: 'POST',
        data: {
          message: content
        },
        success(res) {
          page.setData({message: null})
          let options = page.data.options
          page.getMessages(options)
        }
      })
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let current_user_id = app.globalData.userId //localhost: 2
    this.setData({
      current_user_id,
      options,
    })
    this.getMessages(options)
    
  },

  getMessages(options) {
    let page = this
    let receiver_id = options.id //localhost: 2
    let sender_id = app.globalData.userId //localhost: 4
    let base = app.globalData.baseUrl
    wx.request({
      url: `${base}/users/${sender_id}/messages/show?receiver_id=${receiver_id}`,
      success(res) {
        console.log(321, res.data)
        page.setData({
          messages: res.data,
          message: null
        })
        
        wx.pageScrollTo({
          selector: '#scrollToEnd',
          duration: 0
        })
      }
    })
    console.log("messages:", page.data.messages)
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