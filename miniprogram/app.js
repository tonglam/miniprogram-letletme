import {
  get
} from './utils/request';
import {
  getDeadline,
  showOverallRank
} from './utils/utils';

App({
  globalData: {
    season: '2223',
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
  },

  onShow() {
    this.setCurrentEventAndNextUtcDeadline();
  },

  setCurrentEventAndNextUtcDeadline() {
    get('common/qryCurrentEventAndNextUtcDeadline')
      .then(res => {
        let gw = parseInt(res.data["event"]);
        this.globalData.gw = gw;
        this.globalData.lastGw = gw - 1;
        this.globalData.nextGw = gw + 1;
        this.globalData.utcDeadline = res.data["utcDeadline"];
        this.globalData.deadline = getDeadline(this.globalData.utcDeadline);
        // entry
        this.initEntry();
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  initEntry() {
    let entry = wx.getStorageSync('entry');
    console.log("app entry:" + entry);
    if (entry > 0) {
      this.globalData.entry = entry;
      this.setEntryInfo(entry);
    }
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

  changeEntry(entry) {
    console.log("change entry:" + entry);
    if (!new RegExp("^[1-9]\\d*$").test(entry)) {
      return false;
    }
    // 缓存entry
    this.globalData.entry = entry;
    wx.setStorageSync('entry', entry);
    // 保存entry_info
    this.setEntryInfo(entry);
    // 清理缓存
    this.removeStorage();
  },

  removeStorage() {
    // live-tournament
    wx.removeStorage({
      key: 'live-tournamentId',
    });
    wx.removeStorage({
      key: 'live-tournamentName',
    })
    // stat-select
    wx.removeStorage({
      key: 'stat-select',
    })
    // me-tournament
    wx.removeStorage({
      key: 'me-tournamentId',
    });
    wx.removeStorage({
      key: 'me-tournamentName',
    })
    // me-tournament
    wx.removeStorage({
      key: 'summary-league',
    });
  },

})