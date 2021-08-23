import {
  get
} from '../../../utils/request';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  data: {
    // 数据
    season: '2122',
    name: '',
    teamSummary: {},
    gkpList: [],
    defList: [],
    midList: [],
    fwdList: [],
    // picker
    seasonPicker: false,
    teamPickerShow: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    // 取缓存
    let name = wx.getStorageSync('stat-team');
    if (name !== '') {
      this.setData({
        name: name,
      });
      let season = wx.getStorageSync('stat-team-season');
      if (season !== '') {
        this.setData({
          season: season,
        });
      }
      // 拉取球队数据
      this.getTeamSummary();
    } else {
      this.setData({
        teamPickerShow: true,
      });
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.refreshTeamSummary();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  onClickChangeSeason() {
    this.setData({
      seasonPickerShow: true
    });
  },

  onClickChangeTeam() {
    this.setData({
      teamPickerShow: true
    });
  },

  // 关闭弹出层
  onSeasonPopClose() {
    this.setData({
      seasonPickerShow: false
    });
  },

  onTeamPopClose() {
    this.setData({
      teamPickerShow: false
    });
  },

  // picker回调
  onSeasonPickResult(event) {
    let season = event.detail[0];
    if (season === '' || typeof season === 'undefined') {
      this.setData({
        seasonPickerShow: false,
      });
      return false;
    }
    this.setData({
      seasonPickerShow: false,
      season: season,
    });
    // 存缓存
    wx.setStorageSync('stat-team-season', season);
    // 拉取球队数据
    this.getTeamSummary();
  },

  onTeamPickResult(event) {
    let name = event.detail.name;
    this.setData({
      teamPickerShow: false,
      name: name,
    });
    // 存缓存
    wx.setStorageSync('stat-team', name);
    // 拉取球队数据
    this.getTeamSummary();
  },

  /**
   * 数据
   */

  getTeamSummary() {
    get('stat/qryTeamSummary', {
        season: this.data.season,
        name: this.data.name
      })
      .then(res => {
        let teamSummary = res.data;
        this.setData({
          teamSummary: teamSummary,
          gkpList: teamSummary.playerMap[1],
          defList: teamSummary.playerMap[2],
          midList: teamSummary.playerMap[3],
          fwdList: teamSummary.playerMap[4]
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  refreshTeamSummary() {
    get('stat/refreshTeamSummary', {
        season: this.data.season,
        name: this.data.name
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
        // 拉取球队数据
        this.getTeamSummary();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})