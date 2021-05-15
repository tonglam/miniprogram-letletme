const app = getApp();

import {
  get
} from '../../../utils/request';
import {
  showOverallRank
} from '../../../utils/utils';

Page({

  data: {
    entryInfoData: {},
    activeNames: ['1'],
  },

  onShow: function () {
    let entry = app.globalData.entryInfoData.entry;
    if (entry == 0) {
      this.entryInput();
    }
    this.setEntryInfo(entry);
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
    this.entryInput();
  },

  setEntryInfo(entry) {
    get('entry/qryEntryInfo', {
        entry: entry
      })
      .then(res => {
        let entryInfoData = res.data;
        entryInfoData['overallRank'] = showOverallRank(entryInfoData.overallRank);
        this.setData({
          entryInfoData: entryInfoData
        });
        app.globalData.entryInfoData = entryInfoData;
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  entryInput() {
    wx.redirectTo({
      url: '../../common/entryInput/entryInput'
    });
  },

})