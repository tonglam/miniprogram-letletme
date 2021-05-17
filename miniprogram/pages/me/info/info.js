const app = getApp();

import {
  redirectToEntryInput
} from '../../../utils/utils';

Page({

  data: {
    // 数据
    entryInfoData: {},
    // 折叠面板
    activeNames: ['1'],
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      entryInfoData: app.globalData.entryInfoData
    });
    let entry = this.data.entryInfoData.entry;
    if (entry == 0) {
      redirectToEntryInput();
    }
  },

  /**
   * 操作
   */
   
  // 重新输入team_id
  onClickChangeEntry() {
    // 清缓存
    wx.setStorageSync('entry', 0);
    // 清全局变量
    app.globalData.entryInfoData = {};
    // 跳转输入
    redirectToEntryInput();
  },

  // 折叠面板变化
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

})