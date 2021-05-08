import {showOverallRank} from '../../utils/utils';
import {get} from '../../utils/https';

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
    let that = this;
    if (!this.checkEntry()) {
      return false;
    }
    get('common/qryEntryInfoData', {
        entry: this.data.entry
      })
      .then(res => {
        this.setData({
          entryInfo: res.data
        })
        let overallRank = showOverallRank(that.data.entryInfo.overallRank);
        this.setData({
          "entryInfo.overallRank": overallRank
        });
        wx.redirectTo({
          url: '../index/index'
        });
      })
  }

})