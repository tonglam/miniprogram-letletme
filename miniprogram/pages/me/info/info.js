const app = getApp();

import {
  get
} from '../../../utils/request';
import {
  showOverallRank,
  showChip,
  redirectToEntryInput
} from '../../../utils/utils';

Page({

  data: {
    // 公共数据
    gw: 0,
    entry: 0,
    entryInfoData: {},
    // 简介页
    classicList: {},
    h2hList: {},
    cupList: {},
    historyInfoList: {},
    // 得分页
    entryResultData: {},
    // 排名页
    // picker
    showGwPicker: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    let entry = app.globalData.entry;
    if (entry == 0) {
      redirectToEntryInput();
    }
    // 全局缓存
    this.setData({
      gw: app.globalData.gw,
      entry: entry,
      entryInfoData: app.globalData.entryInfoData
    });
    // 设置标题
    wx.setNavigationBarTitle({
      title: this.data.entryInfoData.playerName,
    })
    // 拉取联赛数据
    this.initEntryLeagueInfo();
    // 拉取历史数据
    this.initEntryHistoryInfo();
  },

  /**
   * 操作
   */

  // tab切换
  tabOnChange(event) {
    let tab = event.detail.name;
    if (tab === '得分') {
      this.getEventResult();
    } else if (tab === '排名') {
      console.log('排名');
    }
  },

  // 重新输入team_id
  onClickChangeEntry() {
    // 清缓存
    wx.setStorageSync('entry', 0);
    // 清全局变量
    app.globalData.entryInfoData = {};
    // 跳转输入
    redirectToEntryInput();
  },

  // 更换GW
  onClickChangeGw() {
    this.setData({
      showGwPicker: true
    });
  },

  // GW选择回填
  onPickGw(event) {
    this.setData({
      showGwPicker: false
    });
    let gw = event.detail;
    if (gw === '' || gw === null) {
      return false;
    }
    if (gw === this.data.gw) {
      return false;
    }
    this.setData({
      gw: gw
    });
    // 拉取周得分数据
    this.getEventResult(gw);
  },



  /**
   * 数据
   */

  // 拉取联赛数据
  initEntryLeagueInfo() {
    get('entry/qryEntryLeagueInfo', {
        entry: this.data.entryInfoData.entry
      })
      .then(res => {
        let list = res.data;
        if (list.entry <= 0) {
          return false;
        }
        this.setData({
          classicList: list.classic,
          h2hList: list.h2h,
          cupList: list.cup.matches,
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 拉取历史数据
  initEntryHistoryInfo() {
    get('entry/qryEntryHistoryInfo', {
        entry: this.data.entryInfoData.entry
      })
      .then(res => {
        let list = [];
        if (list.entry <= 0) {
          return false;
        }
        res.data.past.forEach(element => {
          element.rank = showOverallRank(element.rank);
          list.push(element);
        });
        this.setData({
          historyInfoList: list
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 拉取周得分数据
  getEventResult() {
    get('entry/qryEntryEventResult', {
        event: this.data.gw,
        entry: this.data.entryInfoData.entry
      })
      .then(res => {
        let data = res.data;
        data.chip = showChip(data.chip);
        this.setData({
          entryResultData: data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  }

})