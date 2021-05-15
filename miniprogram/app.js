import {
  get
} from './utils/request';
import {
  getDeadline,
  showOverallRank
} from './utils/utils';

App({
  globalData: {
    gw: 0,
    lastGw: 0,
    nextGw: 0,
    utcDeadline: "",
    deadline: "",
    entryInfoData: {
      entry: 0,
      entryName: "",
      playerName: "",
      region: "",
      startedEvent: 1,
      overallPoints: 0,
      overallRank: 0,
      totalTransfers: 0,
      value: 0.0,
      bank: 0.0,
      teamValue: 0.0
    },
    userInfo: {},
  },

  onLaunch() {
    wx.cloud.init({
      env: 'cloud1',
      traceUser: true,
    });
  },

  onShow() {
    // get gw
    this.setCurrentEventAndNextUtcDeadline();
    // get entry_info
    let entry = wx.getStorageSync('entry');
    if (entry > 0) {
      this.setEntryInfo(entry);
    }
  },

  setCurrentEventAndNextUtcDeadline() {
    get('common/qryCurrentEventAndNextUtcDeadline')
      .then(res => {
        let gw = res.data["event"];
        this.globalData.gw = gw;
        this.globalData.lastGw = parseInt(gw) - 1;
        this.globalData.nextGw = parseInt(gw) + 1;
        let utcDeadline = res.data["utcDeadline"];
        this.globalData.utcDeadline = utcDeadline;
        let deadline = getDeadline(utcDeadline);
        this.globalData.deadline = deadline;
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  setEntryInfo(entry) {
    get('entry/qryEntryInfo', {
        entry: entry
      })
      .then(res => {
        let entryInfoData = res.data;
        entryInfoData['overallRank'] = showOverallRank(entryInfoData.overallRank);
        this.globalData.entryInfoData = entryInfoData;
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})