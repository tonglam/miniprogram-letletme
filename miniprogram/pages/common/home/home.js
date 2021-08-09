import {
  delay
} from '../../../utils/utils';
import {
  diffDeadlineTime
} from '../../../utils/utils';
import {
  get
} from '../../../utils/request';

const app = getApp();

Page({

  data: {
    // 数据
    time: 0,
    nextGw: 0,
    deadline: "",
    timeData: {},
    fixtureList: [],
  },

  /**
   * 原生
   */

  onShow: function () {
    delay(100).then(() => {
      // 设置
      let nextGw = app.globalData.nextGw,
        deadline = app.globalData.deadline,
        time = diffDeadlineTime(app.globalData.utcDeadline);
      this.setData({
        nextGw: nextGw,
        deadline: deadline,
        time: time
      });
    });
    // 拉取赛程
    this.getNextGwFixture();
  },

  /**
   * 操作
   */

  // 倒计时变化
  onChange(event) {
    this.setData({
      timeData: event.detail,
    });
  },

  getNextGwFixture() {
    get('common/qryNextFixture')
      .then(res => {
        this.setData({
          fixtureList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

});