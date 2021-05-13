import {
  get
} from "../../../utils/request";

Page({

  data: {
    tabBarActive: 'playing',
    playStatus: 'playing',
    liveMatchList: [],
    liveBonusList: [],
  },

  onLoad: function (options) {
    this.initLiveMatch();
  },

  // tabBar
  tabBarOnChange(event) {
    this.setData({ tabBarActive: event.detail });
    this.setData({
      playStatus: event.detail
    });
    this.initLiveMatch();
  },

  // tab
  tabOnChange(event) {

  },

  // tabBar
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  initLiveMatch() {
    get('live/qryLiveMatchDataByStatus', {
        playStatus: this.data.playStatus
      })
      .then(res => {
        this.setData({
          liveMatchList: res.data
        });
        console.log(this.data.liveMatchList);
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