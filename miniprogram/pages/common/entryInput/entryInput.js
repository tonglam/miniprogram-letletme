const app = getApp();

import {
  get
} from '../../../utils/request';
import {
  showOverallRank
} from '../../../utils/utils';

Page({
  data: {
    entry: "",
    errorMsg: "",
    userInfo: app.globalData.userInfo,
  },

  onClick() {
    if (!this.checkEntry(this.data.entry)) {
      return false;
    }
    this.saveEntry();
    // if (this.data.app.globalData.userInfo===null) {
    // this.getUserProfile();
    // }
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: "展示个人资料，并于team_id绑定",
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        });
        app.globalData.userInfo = res.userInfo;
      }
    })
  },

  checkEntry() {
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

  saveEntry() {
    let entry = this.data.entry;
    app.globalData.entryInfoData.entry = entry;
    get('entry/qryEntryInfoData', {
      entry: entry
    })
      .then(res => {
        let entryInfoData = res.data;
        this.setData({
          entry: entryInfoData.entry
        });
        entryInfoData['overallRank'] = showOverallRank(entryInfoData.overallRank);
        app.globalData.entryInfoData = entryInfoData;
      })
      .catch(res => {
        console.log('fail:', res);
      });
    wx.redirectTo({
      url: '../../common/index/index'
    });
  },

})