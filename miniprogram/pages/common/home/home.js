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
    // 数据
    gw: 0,
    lastGw: 0,
    nextGw: 0,
    entry: 0,
    entryName: '',
    time: 0,
    deadline: "",
    timeData: {},
    fixtureList: [],
    dreamTeamList: [],
    eliteElmentList: [],
    // tab
    tab: '',
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
        lastGw: app.globalData.lastGw,
        nextGw: app.globalData.nextGw,
        entry: app.globalData.entry,
        entryName: app.globalData.entryInfoData.entryName,
        deadline: app.globalData.deadline,
        time: diffDeadlineTime(app.globalData.utcDeadline)
      });
      if (this.data.entry <= 0) {
        redirectToEntryInput();
      }
      // 设置标题
      let entryName = this.data.entryName;
      if (entryName === '' || typeof entryName === 'undefined') {
        this.initEntryInfo();
      }
      // 拉取赛程
      this.initNextGwFixture();
      // 拉取梦之队
      this.initDreamTeam();
      // 拉取高分球员
      this.initEliteElements();
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
        lastGw: app.globalData.lastGw,
        nextGw: app.globalData.nextGw,
        entry: app.globalData.entry,
        entryName: app.globalData.entryInfoData.entryName,
        deadline: app.globalData.deadline,
        time: diffDeadlineTime(app.globalData.utcDeadline),
        fixtureList: [],
        dreamTeamList: [],
        eliteElmentList: [],
      });
      let tab = this.data.tab;
      if (tab === 'fixture') {
        // 拉取赛程
        this.initNextGwFixture();
      } else if (tab === 'dreamTeam') {
        // 拉取梦之队
        this.initDreamTeam();
      } else if (tab === 'elite') {
        // 拉取高分球员
        this.initEliteElements();
      }
    });
  },

  /**
   * 操作
   */

  // 页面切换
  onSwipperChange(event) {
    let tab = event.detail.currentItemId;
    if (tab === '') {
      return false;
    }
    this.setData({
      tab: tab
    });
    if (tab === 'fixture' && this.data.fixtureList.length === 0) {
      // 拉取赛程
      this.initNextGwFixture();
    } else if (tab === 'dreamTeam' && this.data.dreamTeamList.length === 0) {
      // 拉取梦之队
      this.initDreamTeam();
    } else if (tab === 'elite' && this.data.eliteElmentList.length === 0) {
      // 拉取高分球员
      this.initEliteElements();
    }
  },

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
        this.setData({
          entryName: res.data.entryName
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initDreamTeam() {
    get('common/qryEventDreamTeam', {
        event: this.data.lastGw
      })
      .then(res => {
        let list = res.data;
        this.setData({
          dreamTeamList: list
        })
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  initEliteElements() {
    get('common/qryEventEliteElements', {
        event: this.data.lastGw
      })
      .then(res => {
        let list = res.data;
        this.setData({
          eliteElmentList: list
        });
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

});