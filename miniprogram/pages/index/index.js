import utils from '../../utils/utils'

Page({

  data: {
    time: 30 * 60 * 60 * 1000,
    nextGw: "",
    deadline: "",
    timeData: {},
  },

  onLoad: function () {
    this.getNextEvent()
  },

  onChange(event) {
    this.setData({
      timeData: event.detail,
    });
  },

  getNextEvent() {
    let that = this
    wx.request({
      url: 'https://letletme.top/common/getNextEvent',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          nextGw: res.data
        })
        that.getUtcDeadline()
      }
    })
  },

  getUtcDeadline() {
    let that = this
    wx.request({
      url: 'https://letletme.top/common/getUtcDeadlineByEvent',
      data: {
        event: this.data.nextGw
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let deadline = utils.getDeadline(res.data)
        that.setData({
          deadline: deadline
        })
      }
    })
  }

});