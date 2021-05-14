import {
  get
} from "../../../utils/request";
import {
  compareDescSort
} from '../../../utils/utils';

Page({

  data: {
    tabBarActive: 'playing',
    playStatus: 'playing',
    liveMatchList: [],
    liveBonusList: [],
    liveBpsList: [],
    activeNames: ['1', '2']
  },

  onLoad: function () {
    this.initLiveMatch();
    this.initLiveBonus();
    this.initLiveBps();
  },

  // tab
  tabOnChange(event) {},

  // tabBar
  tabBarOnChange(event) {
    let status = event.detail;
    this.setData({
      tabBarActive: status,
      playStatus: status
    });
    this.initLiveMatch();
    this.initLiveBonus();
    this.initLiveBps();
  },

  handleChange(detail) {
    this.setData({
      current: detail.key
    });
  },

  // collapse-cards
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  initLiveMatch() {
    get('live/qryLiveMatchByStatus', {
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

  initLiveBps() {
    let list = this.data.liveMatchList.sort(compareDescSort("bps")).slice(0, 5);
    this.setData({
      liveBpsList: list
    });
    console.log(this.data.liveBpsList);
  },

})