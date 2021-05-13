import {
  get
} from './utils/request';
import {
  getDeadline
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
      bank: 0,
      teamValue: 0
    },
    userInfo: {},
  },

  onLaunch() {
    wx.cloud.init({
      env: 'cloud1',
      traceUser: true,
    });
    this.setCurrentEventAndNextUtcDeadline();
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

})