const app = getApp();

Page({

  data: {
    gw: 0,
    entryInfoData: {},
  },

  onLoad: function () {
    this.setData({
      gw: app.globalData.gw,
      entryInfoData: app.globalData.entryInfoData
    })
  },

})