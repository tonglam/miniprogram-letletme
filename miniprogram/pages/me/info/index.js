const app = getApp();

Page({

  data: {
    activeNames: ['1'],
    entryInfoData: {},
  },

  onLoad: function () {
    this.setData({
      entryInfoData: app.globalData.entryInfoData
    });
    if (this.data.entryInfoData.entry == 0) {
      this.entryInput();
    }
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  onClickRight() {
    this.entryInput();
  },

  entryInput() {
    app.globalData.entryInfoData = {};
    wx.redirectTo({
      url: '../../common/entryInput/index'
    });
  },

})