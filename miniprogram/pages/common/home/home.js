import {
  get
} from '../../../utils/request';
import {
  delay,
  diffDeadlineTime,
  redirectToEntryInput
} from '../../../utils/utils';

const app = getApp();

Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    entryName: '',
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
    // 设置
    delay(1000).then(() => {
      this.setData({
        gw: app.globalData.gw,
        entry: app.globalData.entry,
        entryName: app.globalData.entryInfoData.entryName,
        nextGw: app.globalData.nextGw,
        deadline: app.globalData.deadline,
        time: diffDeadlineTime(app.globalData.utcDeadline)
      });
      if (this.data.entry <= 0) {
        redirectToEntryInput();
      }
      // 拉取赛程
      this.getNextGwFixture();
      // 设置标题
      let entryName = this.data.entryName;
      if (entryName === '' || typeof entryName === 'undefined') {
        this.initEntryInfo();
      }
    });
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

  initEntryInfo() {
    get('entry/qryEntryInfo', {
        entry: this.data.entry
      }, false)
      .then(res => {
        this.setData({
          entryName: res.data.entryName
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

});