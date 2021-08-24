import {
  get
} from '../../../utils/request';
import {
  showOverallRank,
  showChip,
  redirectToEntryInput
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 公共数据
    gw: 0,
    resultGw: 0,
    entry: 0,
    entryInfoData: {},
    tab: '简介',
    // 简介页
    classicList: {},
    h2hList: {},
    cupList: {},
    historyInfoList: {},
    chips: [],
    // 得分页
    entryResultData: {},
    // 转会页
    noTransfers: false,
    entryTransfersList: [],
    // 排名页
    entryEventSummaryList: [],
    // picker
    showGwPicker: false,
    // refrsh
    pullDownRefresh: false,
    // echart 
  },

  /**
   * 原生
   */

  onLoad: function (options) {
    let entry = 0;
    if (JSON.stringify(options) !== '{}') { // 传入要查询的entry
      entry = parseInt(options.entry);
      this.setData({
        entry: entry
      });
      this.initEntryInfo();
    } else {
      entry = app.globalData.entry;
      let entryInfoData = app.globalData.entryInfoData;
      this.setData({
        entry: entry,
        entryInfoData: entryInfoData
      });
      wx.setNavigationBarTitle({
        title: entryInfoData.playerName,
      });
    }
    if (entry == 0) {
      redirectToEntryInput();
    }
    this.setData({
      gw: app.globalData.gw
    });
    // 设置时间
    let resultGw = this.data.resultGw;
    if (resultGw == 0) {
      this.setData({
        resultGw: this.data.gw
      });
    }
    // 设置标题
    let playerName = this.data.entryInfoData.playerName;
    if (playerName === '' || typeof playerName === 'undefined') {
      this.initEntryInfo();
    }
  },

  onShow: function () {
    // 拉取联赛数据
    this.initEntryLeagueInfo();
    // 拉取历史数据
    this.initEntryHistoryInfo();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    let tab = this.data.tab;
    if (tab === '简介') {
      // 刷新entry_info
      this.refreshEntryInfo();
    } else if (tab === '得分') {
      // 刷新周得分数据
      this.refreshEntryEventResult();
    } else if (tab === '转会') {
      // 刷新周转会数据
      this.refreshEntryEventTransfers();
    } else {
      wx.stopPullDownRefresh({});
    }
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // tab切换
  tabOnChange(event) {
    let tab = event.detail.name;
    this.setData({
      tab: tab
    });
    if (tab === '得分') {
      if (JSON.stringify(this.data.entryResultData) === '{}') {
        this.initEntryEventResult();
      }
    } else if (tab === '转会') {
      if (!this.data.noTransfers && this.data.entryTransfersList.length === 0) {
        this.initEntryEventTransfers();
      }
    } else if (tab === '排行') {

    }
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
      resultGw: gw
    });
    if (this.data.tab === '得分') {
      // 拉取周得分数据
      this.initEntryEventResult();
    } else if (this.data.tab === '转会') {
      // 拉取周转会数据
      this.initEntryEventTransfers();
    }
  },

  /**
   * 数据
   */

  initEntryInfo() {
    get('entry/qryEntryInfo', {
        entry: this.data.entry
      })
      .then(res => {
        let entryInfoData = res.data;
        this.setData({
          entryInfoData: entryInfoData
        });
        wx.setNavigationBarTitle({
          title: entryInfoData.playerName,
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 拉取联赛数据
  initEntryLeagueInfo() {
    get('entry/qryEntryLeagueInfo', {
        entry: this.data.entry
      }, false)
      .then(res => {
        let list = res.data;
        if (list.entry <= 0) {
          return false;
        }
        let classicList = [],
          h2hList = [];
        list.classic.forEach(element => {
          if (element.entry_rank > element.entry_last_rank && element.event > 1) {
            element.redArrow = true;
          } else if (element.entry_rank < element.entry_last_rank && element.event > 1) {
            element.greenArrow = true;
          } else {
            element.noArrow = true;
          }
          classicList.push(element);
        });
        list.h2h.forEach(element => {
          if (element.entry_rank > element.entry_last_rank && element.event > 1) {
            element.greenArrow = true;
          } else if (element.entry_rank < element.entry_last_rank && element.event > 1) {
            element.redArrow = true;
          } else {
            element.noArrow = true;
          }
          h2hList.push(element);
        });
        this.setData({
          classicList: classicList,
          h2hList: h2hList,
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
        entry: this.data.entry
      }, false)
      .then(res => {
        let historyData = res.data;
        if (historyData.entry <= 0) {
          return false;
        }
        // chips
        let chips = [];
        historyData.chips.forEach(element => {
          element.name = showChip(element.name);
          element.event = 'GW' + element.event;
          chips.push(element);
        })
        this.setData({
          chips: chips
        });
        // past
        let list = [];
        historyData.past.forEach(element => {
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
  initEntryEventResult() {
    get('entry/qryEntryEventResult', {
        event: this.data.resultGw,
        entry: this.data.entry
      })
      .then(res => {
        let data = res.data;
        data.overallRank = showOverallRank(data.overallRank);
        data.chip = showChip(data.chip);
        let pickList = [];
        if (data.pickList.length > 0) {
          data.pickList.forEach(element => {
            if (element.pickActive) {
              element.style = "pickFinished";
            } else {
              element.style = "unPick";
            }
            pickList.push(element);
          })
          data.pickList = pickList;
        }
        this.setData({
          entryResultData: data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 拉取周转会数据
  initEntryEventTransfers() {
    let gw = this.data.resultGw;
    if (gw <= 1) {
      return false;
    }
    get('entry/qryEntryEventTransfers', {
        event: gw,
        entry: this.data.entry
      })
      .then(res => {
        let list = res.data;
        if (list.length === 0) {
          this.setData({
            noTransfers: true
          });
        }
        this.setData({
          entryTransfersList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 刷新entry_info
  refreshEntryInfo() {
    get('entry/refreshEntryInfo', {
        entry: this.data.entry
      })
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
        this.initEntryInfo();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 刷新周得分
  refreshEntryEventResult() {
    get('entry/refreshEntryEventResult', {
        event: this.data.resultGw,
        entry: this.data.entry
      })
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
        // 拉取周得分数据
        this.initEntryEventResult();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 刷新周得分
  refreshEntryEventTransfers() {
    get('entry/refreshEntryEventTransfers', {
        event: this.data.resultGw,
        entry: this.data.entry
      })
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
        // 拉取周得分数据
        this.initEntryEventTransfers();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})