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
    entry: 0,
    entryInfoData: {},
    userInfo: {},
  },

  onLaunch() {
    wx.cloud.init({
      env: 'cloud1',
      traceUser: true,
    });
      // get gw
      this.setCurrentEventAndNextUtcDeadline();
      // get entry_info
      let entry = wx.getStorageSync('entry');
      console.log("app entry:" + entry);
      if (entry > 0) {
        this.globalData.entry = entry;
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

  changeEntry(entry) {
    console.log("change entry:"+entry);
    if (!new RegExp("^[1-9]\\d*$").test(entry)) {
      return false;
    }
    // 缓存entry
    this.globalData.entry = entry;
    wx.setStorageSync('entry', entry);
    // 保存entry_info
    this.setEntryInfo(entry);
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