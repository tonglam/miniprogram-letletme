const app = getApp();

Page({

  data: { 
    entry:0,
    errorMsg: "",
    activeNames: ['1']
  },

  onLoad: function (options) {
    this.setData({
      entry : app.globalData.entryInfo.entry
    })
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  checkEntry: function () {
    if (!new RegExp("^[1-9]\\d*$").test(this.data.entry)) {
      this.setData({
        errorMsg: 'team_id需为正整数'
      });
      return false;
    } else {
      this.setData({
        errorMsg: ''
      });
      return true;
    }
  },

  saveEntry: function () {
    if (!this.checkEntry()) {
      return false;
    }
    this.setData({
      entryInfo: app.globalData.entryInfo
    });
    wx.redirectTo({
      url: '../index/index'
    });
  },

})