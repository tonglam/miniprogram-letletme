import {
  get
} from "../../../utils/request";
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    knockoutId: 0,
    knockoutName: "",
    knockoutInfoData: {},
    liveAgainstDataList: [],
    // picker
    showKnockoutPicker: false,
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
      entry: app.globalData.entryInfoData.entry,
    });
    let showKnockoutPicker = false;
    // 取缓存
    let knockoutId = wx.getStorageSync('live-knockoutId');
    if (knockoutId > 0) {
      let knockoutName = wx.getStorageSync('live-knockoutName');
      this.setData({
        knockoutId: knockoutId,
        knockoutName: knockoutName
      });
      // 刷新live
      if (this.data.liveAgainstDataList.length === 0) {
        this.initLiveKnockout();
      }
    } else {
      showKnockoutPicker = true; // 缓存没有时从picker中选择
    }
    this.setData({
      showKnockoutPicker: showKnockoutPicker
    });
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.refreshLiveKnockout();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // 更换联赛
  onClickChange() {
    this.setData({
      showKnockoutPicker: true
    });
  },

  // 赛事选择回填
  onPickKnockout(event) {
    this.setData({
      showKnockoutPicker: false
    });
    let data = event.detail;
    if (data === '') {
      return false;
    }
    let knockoutId = data.id,
      knockoutName = data.name;
    // 存缓存
    wx.setStorageSync('live-knockoutId', knockoutId);
    wx.setStorageSync('live-knockoutName', knockoutName);
    // 设置
    this.setData({
      knockoutId: knockoutId,
      knockoutName: knockoutName
    });
    // 刷新live
    this.initLiveKnockout();
  },

  /**
   * 数据
   */

  initLiveKnockout() {
    get('live/calcLivePointsByKnockout', {
        event: this.data.gw,
        tournamentId: this.data.knockoutId
      })
      .then(res => {
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
        if (res.data.length === 0) {
          return false;
        }
        // 更新
        this.setData({
          liveAgainstDataList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 刷新再拉取数据
  refreshLiveKnockout() {
    get('common/insertEventLiveCache', {
        event: gw
      }, false)
      .then(() => {
        this.initLiveKnockout();
      });
  },

})