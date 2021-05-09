import {
  get
} from './utils/request';
import {
  getDeadline
} from './utils/utils';

App({
  globalData: {
    gw: 0,
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
  },

  onLaunch: function () {

    wx.cloud.init({
      env: 'cloud1',
      traceUser: true,
    });

    this.setCurrentGw();

    this.setNextGw();

  },

  setCurrentGw() {
    get('common/getCurrentEvent')
      .then(res => {
        this.globalData.gw = res.data;
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  setNextGw() {
    get('common/getNextEvent')
      .then(res => {
        let nextGw = res.data;
        this.globalData.nextGw = nextGw;
        this.setDeadline(nextGw);
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  setDeadline(gw) {
    get('common/getUtcDeadlineByEvent', {
        event: gw
      })
      .then(res => {
        this.globalData.utcDeadline = res.data;
        this.globalData.deadline = getDeadline(res.data);
      });
  },

})