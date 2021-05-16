const app = getApp();

import {
  redirectToEntryInput
} from '../../../utils/utils';

Page({

  data: {
    entryInfoData: {},
    activeNames: ['1'],
  },

  onShow: function () {
    this.setData({
      entryInfoData: app.globalData.entryInfoData
    });
    let entry = this.data.entryInfoData.entry;
    if (entry == 0) {
      redirectToEntryInput();
    }
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  onClickRight() {
    // 清缓存
    wx.setStorageSync('entry', 0);
    // 清全局变量
    app.globalData.entryInfoData = {};
    // 跳转输入
    redirectToEntryInput();
  },

})