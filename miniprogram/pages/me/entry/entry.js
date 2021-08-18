import {
  get
} from '../../../utils/request';
import {
  showOverallRank,
  showChip,
  redirectToEntryInput
} from '../../../utils/utils';

const app = getApp();

Page({

  data: {
    // 公共数据
    gw: 0,
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
    entryTransfersData: {},
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
    let playerName = this.data.entryInfoData.playerName;
    if (playerName === '' || typeof playerName === 'undefined') {
      return false;
    }
    wx.setNavigationBarTitle({
      title: playerName,
    });
    // 拉取联赛数据
    this.initEntryLeagueInfo();
    // 拉取历史数据
    this.initEntryHistoryInfo();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 拉取联赛数据
    this.initEntryLeagueInfo();
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
        this.getEntryEventResult();
      }
    } else if (tab === '转会') {
      if (JSON.stringify(this.data.entryTransfersData) === '{}') {
        this.getEntryEventTransfers();
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
      gw: gw
    });
    if (this.data.tab === '得分') {
      // 拉取周得分数据
      this.getEntryEventResult(gw);
    } else if (this.data.tab === '转会') {
      // 拉取周转会数据
      this.getEntryEventTransfers(gw);
    }
  },

  /**
   * 数据
   */

  // 拉取联赛数据
  initEntryLeagueInfo() {
    get('entry/qryEntryLeagueInfo', {
        entry: this.data.entry
      }, false)
      .then(res => {
        // 下拉刷新
        if (this.data.pullDownRefresh) {
          wx.stopPullDownRefresh({
            success: () => {
              Toast({
                type: 'success',
                duration: 400,
                message: "刷新成功"
              });
              this.setData({
                pullDownRefresh: false
              });
            },
          });
        }
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
  getEntryEventResult() {
    get('entry/qryEntryEventResult', {
        event: this.data.gw,
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
  getEntryEventTransfers() {
    if (this.data.gw <= 1) {
      return false;
    }
    get('entry/qryEntryEventTransfers', {
        event: this.data.gw,
        entry: this.data.entry
      })
      .then(res => {
        this.setData({
          entryTransfersData: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 拉取周得分数据总和
  getEntryEventSummary() {
    get('entry/qryEntryEventSummary', {
        entry: this.data.entry
      })
      .then(res => {
        this.setData({
          entryEventSummaryList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})