// pages/chat_message/chat_message.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    current_user_id: 0,
    options: 0,
    messages: []
  },


  send(e) {
    console.log("submit e:", e)
    console.log("submit data:", e.detail.value)
    let page = this
    let user_id = 2 //app.globalData.userId;
    let base = app.globalData.baseUrl
    let receiver_id = page.data.options.id
    let content = e.detail.value
    // { message: {content: 'test'} }
    if (content.content.length > 1) {
      wx.request({
        url: `${base}/users/${user_id}/messages/?receiver_id=${receiver_id}`,
        method: 'POST',
        data: {
          message: content
        },
        success(res) {
          // PUSH TO ARRAY
          // let new_message = res.data.message
          // console.log("original messages", page.data.messages)
          // let messages = page.data.messages
          // messages.push(new_message)
          // page.setData({
          //   messages,
          // })
          // wx.pageScrollTo({
          //   selector: '#scrollToEnd',
          //   duration: 0
          // })
          // REFRESH LOG
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
    // console.log(123, options)
    // set the users id to be able to display user messages on right hand side in html
    this.setData({
      current_user_id: 2, //app.globalData.userId
      options,
    })
    this.getMessages(options)
    
  },

  getMessages(options) {
    let page = this
    let sender_id = options.id
    let receiver_id = 2 //app.globalData.userId;
    let base = app.globalData.baseUrl
    // console.log(123, `${base}/users/${sender_id}/messages/show?receiver_id=${receiver_id}`)
    // get messsages between current user and the sender they clicked on in index from database
    wx.request({
      url: `${base}/users/${sender_id}/messages/show?receiver_id=${receiver_id}`,
      success(res) {
        console.log(321, res.data.messages)
        page.setData({
          messages: res.data.messages
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