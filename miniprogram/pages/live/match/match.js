import {
  get
} from "../../../utils/request";

const matchPlayStatus = {
  'playing': 0,
  'finished': 1,
  'notStart': 2
};

Page({

  data: {
    playStatus: '0',
    liveMatchList: [],
    liveBonusList: [],
  },

  onLoad: function (options) {
    this.initLiveMatch();
  },

  onChange(event) {
    this.setData({
      playStatus: event.detail.name
    });
    this.initLiveMatch();
  },

  initLiveMatch() {
    get('live/qryLiveTeamData', {
        statusId: this.data.playStatus
      })
      .then(res => {
        this.setData({
          liveMatchList: res.data
        });
        console.log(this.data.liveMatchList);
        this.initLiveBonus();
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  initLiveBonus() {
    let list = [];
    this.data.liveMatchList.forEach(element => {
      if (element.bonus > 0) {
        list.push(element);
      };
      this.setData({
        liveBonusList: list
      });
      console.log(this.data.liveBonusList);
    });
  },

})