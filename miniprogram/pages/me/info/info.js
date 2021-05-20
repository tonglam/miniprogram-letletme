import {
  get
} from '../../../utils/request';
import {
  showOverallRank,
  showChip,
  redirectToEntryInput
} from '../../../utils/utils';
import * as echarts from '../../../ec-canvas/echarts';

const app = getApp();
var barec = null;

Page({

  data: {
    // 公共数据
    gw: 0,
    entry: 0,
    entryInfoData: {},
    tab: "简介",
    // 简介页
    classicList: {},
    h2hList: {},
    cupList: {},
    historyInfoList: {},
    chips: [],
    // 得分页
    entryResultData: {},
    // 转会页
    entryTransfersList: {},
    // 排名页
    entryEventSummaryList: [],
    // picker
    showGwPicker: false,
    // refrsh
    pullDownRefresh: false,
    // echart 
    chartShow: false,
    xAxis: [],
    yAxis: [],
    datas: [],
    chartBar: { //图表
      onInit: function (canvas, width, height) {
        barec = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barec);
        return barec;
      }
    },
  },

  /**
   * 原生
   */

  onLoad: function () {
    
  },

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

    this.getchartData();
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
      this.getEntryEventResult();
    } else if (tab === '转会') {
      this.getEntryEventTransfers();
    } else if (tab === '排名') {
      // this.getEntryEventSummary();
      this.setData({
        chartShow: true,
        xAxis: ['GW1', 'GW2', 'GW3', 'GW4', 'GW5', 'GW6', 'GW7'],
        datas: [18, 23, 17, 24, 28, 16, 31]
      });
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
      })
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
          if (element.entry_rank > element.entry_last_rank) {
            element.redArrow = true;
          } else if (element.entry_rank < element.entry_last_rank) {
            element.greenArrow = true;
          } else {
            element.noArrow = true;
          }
          classicList.push(element);
        });
        list.h2h.forEach(element => {
          if (element.entry_rank > element.entry_last_rank) {
            element.greenArrow = true;
          } else if (element.entry_rank < element.entry_last_rank) {
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
      })
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
        data.pickList.forEach(element => {
          if (element.pickActive) {
            element.style = "pickFinished";
          } else {
            element.style = "unPick";
          }
          pickList.push(element);
        })
        data.pickList = pickList;
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
    get('entry/qryEntryEventTransfers', {
        event: this.data.gw,
        entry: this.data.entry
      })
      .then(res => {
        this.setData({
          entryTransfersList: res.data
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

  getchartData() {
    barec.setOption({
      title: {
        text: "近7日接诊趋势图：单位(人)",
        textStyle: {
          color: '#333',
          fontWeight: 'bold',
          fontSize: 14,
        }
      },
      legend: {
        show: true,
        top: "20rpx"
      },
      tooltip: {},
      dataset: {
        source: [
          ['', '线下', '电话'],
          ['Matcha Latte', 43.3, 85.8],
          ['Milk Tea', 83.1, 73.4]
        ]
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {},
      series: [{
          type: 'bar',
          color: '#ffc300'
        },
        {
          type: 'bar'
        }
      ]
    })
  },

})