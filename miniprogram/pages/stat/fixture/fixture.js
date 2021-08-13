import {
  get
} from '../../../utils/request';

Page({

  data: {
    fixtureList:[]
  },

  /**
   * 原生
   */

  onShow: function () {
   
  },

  /**
   * 数据
   */

  /**
   * 画图
   */

  initSeasonFixtureChart() {
    if (this.data.chartShow) {
      this.selectComponent('#seasonFixtureChart').setData({
        resultList: this.data.fixtureList
      });
    }
  },

})