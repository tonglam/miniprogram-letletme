import {
  get
} from './utils/request';
import {getDeadline} from './utils/utils';

App({
  globalData: {
    event: 0,
    nextEvent: 0,
    deadline: "",
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
  },

  onLaunch: function () {
    wx.cloud.init({
      env: 'cloud1',
      traceUser: true,
    });

    this.setCurrentEvent();

    this.setNextEvent();

  },

  setCurrentEvent() {
    get('common/getCurrentEvent')
      .then(res => {
        let event = res.data;
        this.globalData.event = event;
        this.setDeadline(event);
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  setNextEvent() {
    get('common/getNextEvent')
      .then(res => {
        this.globalData.nextEvent = res.data;
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  setDeadline(event) {
    get('common/getUtcDeadlineByEvent', {
        event: event
      })
      .then(res => {
        this.globalData.deadline = getDeadline(res.data);
      });
  },

})