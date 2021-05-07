import utils from '../../utils/utils'

Page({
  
  data: {
    entry: "",
    entryInfo: {
      entry: 0,
      entryName: "",
      playerName: "",
      region: "",
      startedEvent: 1,
      overallPoints: 0,
      overallRank: 0,
      bank: 0,
      teamValue: 0
    },
    errorMsg: "",
    activeNames: ['1']
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
      })
      return false;
    } else {
      this.setData({
        errorMsg: ''
      })
      return true;
    }
  },

  saveEntry: function () {
    let that = this
    if (!this.checkEntry()) {
      return false;
    }
    wx.request({
      url: 'https://letletme.top/common/qryEntryInfoData',
      data: {
        entry: this.data.entry
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          entryInfo: res.data
        })
        let overallRank = utils.showOverallRank( that.data.entryInfo.overallRank)
        this.setData({
          "entryInfo.overallRank": overallRank
        })
        wx.redirectTo({
          url: '../scout/scout'
        })
      }
    })
  }

})