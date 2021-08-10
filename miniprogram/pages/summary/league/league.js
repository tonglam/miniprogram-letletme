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
    entryName: '',
    leagueName: "",
    infoShow: true,
    infoData: {},
    summaryData: {},
    captainData: {},
    scoreData: {},
    mostSelectPosition: ['最多选择门将', '最多选择后卫', '最多选择中场', '最多选择前锋'],
    mostScorePosition: ['门将得分最多', '后卫得分最多', '中场得分最多', '前锋得分最多'],
    // picker
    showLeaguePicker: false,
    // chart
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      entry: app.globalData.entry,
      entryName: app.globalData.entryInfoData.entryName
    });
    // 取缓存
    let name = wx.getStorageSync('summary-league');
    if (name !== '') {
      this.setData({
        name: name
      });
      // 设置标题
      wx.setNavigationBarTitle({
        title: name,
      })
      // 拉取info
      this.initLeagueSeasonInfo();
      // 拉取summary
      this.initLeagueSeasonSummary();
    } else {
      this.setData({
        showLeaguePicker: true
      });
    }
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // 更换联赛
  onClickChange() {
    this.setData({
      showLeaguePicker: true
    });
  },

  // 联赛选择回填
  onPickLeague(event) {
    this.setData({
      showLeaguePicker: false
    });
    let name = event.detail;
    if (name === '') {
      return false;
    }
    // 存缓存
    wx.setStorageSync('summary-league', name);
    // 设置
    this.setData({
      name: name,
    });
    // 拉取info
    this.initLeagueSeasonInfo();
    // 拉取summary
    this.initLeagueSeasonSummary();
  },

  tabOnChange(event) {
    let name = event.detail.name;
    if (name === 'summary') {
      this.setData({
        infoShow: true,
      });
      // 拉取summary
      this.initLeagueSeasonSummary();
    } else if (name === 'captain') {
      this.setData({
        infoShow: true,
      });
      // 拉取captain
      this.initLeagueSeasonCaptain();
    } else if (name === 'score') {
      this.setData({
        infoShow: true,
      });
      // 拉取score
      this.initLeagueSeasonScore();
    }
  },

  onMostSelectCollapseChange(event){
    this.setData({
      mostSelectPosition: event.detail,
    });
  },

  onMostScoreCollapseChange(event){
    this.setData({
      mostScorePosition: event.detail,
    });
  },

  /**
   * 数据
   */

  initLeagueSeasonInfo() {
    get('summary/qryLeagueSeasonInfo', {
        leagueName: this.data.name
      })
      .then(res => {
        let data = res.data;
        this.setData({
          infoData: data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initLeagueSeasonSummary() {
    get('summary/qryLeagueSeasonSummary', {
        leagueName: this.data.name,
        entry: this.data.entry
      })
      .then(res => {
        let data = res.data;
        data['entryOverallRank'] = showOverallRank(data.entryOverallRank);
        this.setData({
          summaryData: data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initLeagueSeasonCaptain() {
    get('summary/qryLeagueSeasonCaptain', {
        leagueName: this.data.name,
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

  initLeagueSeasonScore() {
    get('summary/qryLeagueSeasonScore', {
        leagueName: this.data.name,
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