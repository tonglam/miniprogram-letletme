import {
  get
} from "../../../utils/request";
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 数据
    season: '2122',
    gw: 1,
    name: "",
    selectData: {},
    // picker
    showGwPicker: false,
    showLeaguePicker: false,
    // refrsh
    pullDownRefresh: false,
  },

  /**
   * 原生
   */
  onShow: function () {
    // 设置
    this.setData({
      gw: app.globalData.gw,
    });
    // 取缓存
    let name = wx.getStorageSync('stat-select');
    if (name !== '') {
      this.setData({
        name: name
      });
      // 拉取select
      this.initLeagueSelect();
    } else {
      this.setData({
        showLeaguePicker: true
      });
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 刷新
    this.refreshLeagueSelect();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.refreshLeagueSelect();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // 更换GW
  onClickChangeGw() {
    this.setData({
      showGwPicker: true
    });
  },

  // 更换联赛
  onClickChangeLeague() {
    this.setData({
      showLeaguePicker: true
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
    // 拉取select
    this.initLeagueSelect();
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
    wx.setStorageSync('stat-select', name);
    // 设置
    this.setData({
      name: name,
    });
    // 拉取select
    this.initLeagueSelect();
  },

  /**
   * 数据
   */

  initLeagueSelect() {
    get('stat/qryLeagueSelectByName', {
        event: this.data.gw,
        leagueName: this.data.name
      })
      .then(res => {
        // 下拉刷新
        if (this.data.pullDownRefresh) {
          this.setData({
            pullDownRefresh: false
          });
          wx.stopPullDownRefresh({
            success: () => {
              Toast({
                type: 'success',
                duration: 1000,
                message: "刷新成功"
              });
            },
          });
        }
        this.setData({
          selectData: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  refreshLeagueSelect() {
    get('stat/refreshLeagueSelect', {
        event: this.data.gw,
        leagueName: this.data.name
      })
      .then(() => {
        // 下拉刷新
        if (this.data.pullDownRefresh) {
          wx.stopPullDownRefresh({
            success: () => {
              Toast({
                type: 'success',
                duration: 1000,
                message: "后台刷新中"
              });
              this.setData({
                pullDownRefresh: false
              });
            },
          });
        }
        delay(60000).then(() => {
          Toast({
            type: 'success',
            duration: 1000,
            message: "刷新成功"
          });
          // 拉取select
          this.initLeagueSelect();
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})