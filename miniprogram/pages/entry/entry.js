const app = getApp();

import {
  get
} from '../../utils/request'

Page({

  data: {
    entryInfoData: {
      entry : 0
    },
    errorMsg: "",
    activeNames: ['1']
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  checkEntry: function (entry) {
    if (!new RegExp("^[1-9]\\d*$").test(entry)) {
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
    let entry = this.data.entry;
    if (!this.checkEntry(entry)) {
      return false;
    }
    app.globalData.entryInfoData.entry = entry;
    get('common/qryEntryInfoData', {
        entry: entry
      })
      .then(res => {
        let entryInfoData = res.data;
        this.setData({
          entryInfoData: entryInfoData
        });
        app.globalData.entryInfoData = entryInfoData;
      })
    wx.switchTab({
      url: '../index/index'
    });
  },

})