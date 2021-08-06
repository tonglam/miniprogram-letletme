import {
  get
} from '../../../utils/request';

Page({

  data: {
    // 数据
    season: '2122',
    name: '',
    teamSummary: {},
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
      // 拉取球队数据
      this.getTeamSummary();
    } else {
      this.setData({
        teamPickerShow: true,
      });
    }
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
    this.setData({
      seasonPickerShow: false,
      season: season,
    });
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
        this.setData({
          teamSummary: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})