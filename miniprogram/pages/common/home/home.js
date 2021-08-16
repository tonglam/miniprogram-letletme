import {
  delay
} from '../../../utils/utils';
import {
  diffDeadlineTime,
  redirectToEntryInput
} from '../../../utils/utils';
import {
  get
} from '../../../utils/request';

const app = getApp();

Page({

  data: {
    // 数据
    gw: 0,
    time: 0,
    nextGw: 0,
    deadline: "",
    timeData: {},
    entryInfoData: {},
    fixtureList: [],
  },

  /**
   * 原生
   */

  onShow: function () {
    delay(100).then(() => {
      // 设置
      this.setData({
        gw: app.globalData.gw,
        nextGw: app.globalData.nextGw,
        deadline: app.globalData.deadline,
        entryInfoData: app.globalData.entryInfoData,
        time: diffDeadlineTime(app.globalData.utcDeadline)
      });
      // 拉取赛程
      this.getNextGwFixture();
    });
    if (this.data.entryInfoData.entryName === '') {
      redirectToEntryInput();
    }
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

  // 重新输入team_id
  onClickChangeEntry() {
    // 清缓存
    wx.setStorageSync('entry', 0);
    // 清全局变量
    app.globalData.entry = 0;
    app.globalData.entryInfoData = {};
    // 跳转输入
    redirectToEntryInput();
  },

  /**
   * 数据
   */

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