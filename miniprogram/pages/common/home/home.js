import {
  get
} from '../../../utils/request';
import {
  delay,
  diffDeadlineTime,
  redirectToEntryInput
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 公共数据
    gw: 0,
    nextGw: 0,
    entry: 0,
    entryInfoData: {},
    time: 0,
    deadline: "",
    timeData: {},
    fixtureList: [],
    // refresh
    pullDownRefresh: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    // 设置
    delay(400).then(() => {
      this.setData({
        gw: app.globalData.gw,
        entry: app.globalData.entry,
        entryInfoData: app.globalData.entryInfoData,
        nextGw: app.globalData.nextGw,
        deadline: app.globalData.deadline,
        time: diffDeadlineTime(app.globalData.utcDeadline)
      });
      // 拉取赛程 
      if (this.data.fixtureList.length == 0) {
        this.initNextGwFixture();
      }
      // 设置标题 
      let entryName = this.data.entryName;
      if (entryName === '' || typeof entryName === 'undefined') {
        this.initEntryInfo();
      }
    });
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 刷新gw
    this.refreshEventAndDeadline();
    // 拉取gw数据
    app.setCurrentEventAndNextUtcDeadline();
    delay(400).then(() => {
      this.setData({
        gw: app.globalData.gw,
        nextGw: app.globalData.nextGw,
        entry: app.globalData.entry,
        entryInfoData: app.globalData.entryInfoData,
        deadline: app.globalData.deadline,
        time: diffDeadlineTime(app.globalData.utcDeadline),
      });
      // 拉取赛程
      this.initNextGwFixture();
    });
  },

  onShareAppMessage: function () {

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

  // 倒计时归零
  onFinish() {
    this.refreshEventAndDeadline();
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

  refreshEventAndDeadline() {
    get('common/refreshEventAndDeadline')
      .then(() => {
        // 下拉刷新
        if (this.data.pullDownRefresh) {
          wx.stopPullDownRefresh({
            success: () => {
              Toast({
                type: 'success',
                duration: 1000,
                message: "刷新成功"
              });
              this.setData({
                pullDownRefresh: false
              });
            },
          });
        }
      });
  },

  initNextGwFixture() {
    get('common/qryNextFixture', {
        event: this.data.gw
      })
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
        let data = res.data;
        this.setData({
          entryInfoData: data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

});