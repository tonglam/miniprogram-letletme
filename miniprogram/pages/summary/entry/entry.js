import {
  get
} from "../../../utils/request";
import {
  showOverallRank
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    entryName: "",
    playerName: "",
    infoShow: true,
    infoData: {},
    summaryData: {},
    captainData: {},
    transfersData: {},
    scoreData: {},
    // pop
    popShow: false,
    // collapse-cards
    activeBestTransfersNames: [],
    activeWorstTransfersNames: [],
    activeMostTransfersInNames: [],
    activeMostTransfersOutNames: [],
    activeMostTransfersNames: [],
    activeTransfersCostNames: [],
    // chart
    chartShow: false,
    scoreList: [],
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      gw: app.globalData.gw,
      entry: app.globalData.entry
    });
    // 设置标题
    wx.setNavigationBarTitle({
      title: app.globalData.entryInfoData.playerName,
    })
    // 拉取info
    if (JSON.stringify(this.data.infoData) === '{}') {
      this.initEntrySeasonInfo();
    }
    // 拉取summary
    if (JSON.stringify(this.data.summaryData) === '{}') {
      this.initEntrySeasonSummary();
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 刷新周得分数据
    this.refreshEntrySummary();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // 更换team_id
  onClickChange() {
    this.setData({
      entry: "",
      popShow: true
    });
  },

  // 关闭弹出层
  onPopClose() {
    this.setData({
      entry: 0,
      popShow: false
    });
  },

  // 标签页切换
  tabOnChange(event) {
    let name = event.detail.name;
    if (name === 'summary') {
      this.setData({
        infoShow: true,
        chartShow: false
      });
      // 拉取summary
      if (JSON.stringify(this.data.summaryData) === '{}') {
        this.initEntrySeasonSummary();
      }
    } else if (name === 'captain') {
      this.setData({
        infoShow: true,
        chartShow: false
      });
      // 拉取captain
      if (JSON.stringify(this.data.captainData) === '{}') {
        this.initEntrySeasonCaptain();
      }
    } else if (name === 'transfers') {
      this.setData({
        infoShow: true,
        chartShow: false
      });
      // 拉取transfers
      if (JSON.stringify(this.data.transfersData) === '{}') {
        this.initEntrySeasonTransfers();
      }
    } else if (name === 'score') {
      this.setData({
        infoShow: true,
        chartShow: false
      });
      if (JSON.stringify(this.data.scoreData) === '{}') {
        // 拉取score
        this.initEntrySeasonScore();
      }
    } else if (name === 'chart') {
      this.setData({
        infoShow: false,
        chartShow: true
      });
      if (this.data.scoreList.length === 0) {
        // 拉取score
        this.initEntrySeasonScore();
      }
    }
  },

  // 折叠面板切换
  onBestTransfersChange(event) {
    this.setData({
      activeBestTransfersNames: event.detail,
    });
  },

  onWorstTransfersChange(event) {
    this.setData({
      activeWorstTransfersNames: event.detail,
    });
  },

  onMostTransfersInChange(event) {
    this.setData({
      activeMostTransfersInNames: event.detail,
    });
  },

  onMostTransfersOutChange(event) {
    this.setData({
      activeMostTransfersOutNames: event.detail,
    });
  },

  onMostTransfersChange(event) {
    this.setData({
      activeMostTransfersNames: event.detail,
    });
  },

  onTransfersCostChange(event) {
    this.setData({
      activeTransfersCostNames: event.detail,
    });
  },

  /**
   * 数据
   */

  initEntrySeasonInfo() {
    get('summary/qryEntrySeasonInfo', {
        entry: this.data.entry
      })
      .then(res => {
        let data = res.data;
        data['overallRank'] = showOverallRank(data.overallRank);
        this.setData({
          entryName: data.entryName,
          playerName: data.playerName,
          infoData: data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initEntrySeasonSummary() {
    get('summary/qryEntrySeasonSummary', {
        entry: this.data.entry
      })
      .then(res => {
        let data = res.data;
        data['highestOverallRank'] = showOverallRank(data.highestOverallRank);
        data['lowestOverallRank'] = showOverallRank(data.lowestOverallRank);
        this.setData({
          summaryData: data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initEntrySeasonCaptain() {
    get('summary/qryEntrySeasonCaptain', {
        entry: this.data.entry
      })
      .then(res => {
        let data = res.data;
        this.setData({
          captainData: data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initEntrySeasonTransfers() {
    get('summary/qryEntrySeasonTransfers', {
        entry: this.data.entry
      })
      .then(res => {
        let data = res.data;
        this.setData({
          transfersData: data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initEntrySeasonScore() {
    get('summary/qryEntrySeasonScore', {
        entry: this.data.entry
      })
      .then(res => {
        let data = res.data;
        this.setData({
          scoreData: data
        });
        this.setScoreList(data);
        // 画图
        this.initScoreChart();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  setScoreList(data) {
    let list = [{
        value: data.gkpTotalPoints,
        name: '门将'
      },
      {
        value: data.defTotalPoints,
        name: '后卫'
      },
      {
        value: data.midTotalPoints,
        name: '中场'
      },
      {
        value: data.fwdTotalPoints,
        name: '前锋'
      }
    ];
    this.setData({
      scoreList: list
    });
  },

  // 刷新周得分
  refreshEntrySummary() {
    get('summary/refreshEntrySummary', {
        event: this.data.gw,
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
        // 拉取info
        this.initEntrySeasonInfo();
        // 拉取summary
        this.initEntrySeasonSummary();
        // 拉取captain
        this.initEntrySeasonCaptain();
        // 拉取transfers
        this.initEntrySeasonTransfers();
        // 拉取score
        this.initEntrySeasonScore();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  /**
   * 画图
   */

  initScoreChart() {
    if (this.data.chartShow) {
      this.selectComponent('#scoreChart').setData({
        scoreList: this.data.scoreList
      });
    }
  },

})