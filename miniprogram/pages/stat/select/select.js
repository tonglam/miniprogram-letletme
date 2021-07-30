import {
  get
} from "../../../utils/request";

const app = getApp();

Page({

  data: {
    // 数据
    gw: 0,
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
      gw: 1
      // gw: app.globalData.gw,
    });
    // 取缓存
    let name = wx.getStorageSync('leagueName');
    if (name !== '') {
      this.setData({
        name: name
      });
      // 拉取select
      this.getLeagueSelect();
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
    this.getLeagueSelect();
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
    this.getLeagueSelect();
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
    wx.setStorageSync('leagueName', name);
    // 设置
    this.setData({
      name: name,
    });
    // 拉取select
    this.getLeagueSelect();
  },

  /**
   * 数据
   */
  getLeagueSelect() {
    get('stat/qryTeamSelectByLeagueName', {
        event: this.data.gw,
        leagueName: this.data.name
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
        this.setData({
          selectData: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})