import {
  get
} from "../../../utils/request";
import {
  showOverallRank
} from '../../../utils/utils';

const app = getApp();

Page({

  data: {
    // 数据
    entry: 0,
    entryName: "",
    playerName: "",
    infoData: {},
    summaryData: {},
    captainData: {},
    transfersData: {},
    scoreData: {},
    // pop
    popShow: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      entry: app.globalData.entry
    });
    // 拉取info
    this.initEntrySeasonInfo();
    // 拉取summary
    this.initEntrySeasonSummary();
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

  // team_id输入确认
  onClickInput() {
    this.initEntrySeasonInfo();
    this.setData({
      popShow: false
    });
  },

  // 标签页切换
  onNavBarChange(event) {
    let name = event.detail.name;
    if (name === 'summary') {
      // 拉取summary
      this.initEntrySeasonSummary();
    } else if (name === 'captain') {
      // 拉取captain
      this.initEntrySeasonCaptain();
    } else if (name === 'transfers') {
      // 拉取transfers
      this.initEntrySeasonTransfers();
    } else if (name === 'score') {
      // 拉取score
      this.initEntrySeasonScore();
    }
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
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})