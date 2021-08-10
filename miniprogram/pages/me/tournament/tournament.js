import {
  get
} from "../../../utils/request";
import {
  getChipName
} from '../../../utils/utils';

const app = getApp();

Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    entryName: "",
    tournamentId: 0,
    tournamentName: "",
    tournamentInfoData: {},
    // picker
    showGwPicker: false,
    showTournamentPicker: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      gw: app.globalData.gw,
      entry: app.globalData.entry,
      entryName: app.globalData.entryInfoData.entryName
    });
    // 设置标题
    let entryName = this.data.entryName;
    if (entryName !== '' || typeof entryName !== 'undefined') {
      wx.setNavigationBarTitle({
        title: entryName,
      })
    }
    // 取缓存
    let tournamentId = wx.getStorageSync('me-tournamentId');
    let tournamentName = wx.getStorageSync('me-tournamentName');
    if (tournamentId > 0 && tournamentName !== '') {
      this.setData({
        tournamentId: tournamentId,
        tournamentName: tournamentName
      });
    } else {
      this.setData({
        showTournamentPicker: true
      });
    }
  },

  onShareAppMessage: function () {

  },


  /**
   * 操作
   */

  onClickChangeGw() {
    this.setData({
      showGwPicker: true
    });
  },

  onClickChangeTournament() {
    this.setData({
      showTournamentPicker: true
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

  },

  // 赛事选择回填
  onPickTournament(event) {
    this.setData({
      showTournamentPicker: false
    });
    let data = event.detail;
    if (data === '') {
      return false;
    }
    let tournamentId = data.id,
      tournamentName = data.name;
    // 存缓存
    wx.setStorageSync('me-tournamentId', tournamentId);
    wx.setStorageSync('me-tournamentName', tournamentName);
    // 设置
    this.setData({
      tournamentId: tournamentId,
      tournamentName: tournamentName
    });

  },

  /**
   * 数据
   */


})