import {
  get
} from '../../../utils/request';

const app = getApp();

Page({

  data: {
    season: '',
    gwList: [],
    fixtureList: [],
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      season: app.globalData.season
    });
    this.initGwList();
    this.initFixtureList();
  },

  /**
   * 数据
   */

  initGwList() {
    let list = ['team'];
    for (let i = 1; i < 39; i++) {
      list.push('GW' + i);
    }
    this.setData({
      gwList: list
    });
  },

  initFixtureList() {
    get('stat/qrySeasonFixture')
      .then(res => {
        this.setData({
          fixtureList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})