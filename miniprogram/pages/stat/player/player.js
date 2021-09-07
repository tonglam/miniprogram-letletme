import {
  get
} from '../../../utils/request';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 数据
    season: '',
    playerInfo: {},
    playerSummary: {},
    // picker
    seasonPicker: false,
    playerPickerShow: false,
  },

  /**
   * 原生
   */

  onLoad: function (options) {
    let code = '',
      season = '';
    if (JSON.stringify(options) !== '{}') { // 传入要查询的球员信息
      season = options.season,
        code = options.code;
      this.setData({
        season: season,
        "playerInfo.code": code,
      });
    } else {
      // 取缓存
      code = wx.getStorageSync('stat-player');
      if (code > 0) {
        this.setData({
          "playerInfo.code": code,
        });
      } else {
        this.setData({
          playerPickerShow: true,
        });
      }
      season = wx.getStorageSync('stat-player-season');
      if (season === '') {
        season = app.globalData.season;
      }
      this.setData({
        season: season,
      });
    }
    // 拉取球员数据
    this.getPlayerInfo();
    this.getPlayerSummary();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.refreshPlayerSummary();
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

  onClickChangePlayer() {
    this.setData({
      playerPickerShow: true
    });
  },

  // 关闭弹出层
  onSeasonPopClose() {
    this.setData({
      seasonPickerShow: false
    });
  },

  onPlayerPopClose() {
    this.setData({
      playerPickerShow: false
    });
  },

  // picker回调
  onSeasonPickResult(event) {
    let season = event.detail;
    this.setData({
      seasonPickerShow: false,
      season: season,
    });
    // 存缓存
    wx.setStorageSync('stat-player-season', season);
    // 拉取球员数据
    this.getPlayerInfo();
    this.getPlayerSummary();
  },

  onPlayerPickResult(event) {
    this.setData({
      playerPickerShow: false
    });
    let playerInfo = event.detail;
    if (playerInfo === '' || playerInfo === null) {
      return false;
    }
    // 存缓存
    wx.setStorageSync('stat-player', playerInfo.code);
    // 设置
    this.setData({
      playerInfo: playerInfo,
    });
    // 拉取球员数据
    this.getPlayerInfo();
    this.getPlayerSummary();
  },

  /**
   * 数据
   */

  getPlayerInfo() {
    get('player/qryPlayerInfoByCode', {
        season: this.data.season,
        code: this.data.playerInfo.code
      })
      .then(res => {
        let playerInfo = res.data;
        if (playerInfo.element === 0) {
          playerInfo = {
            "element": 0,
            "code": this.data.playerInfo.code,
            "webName": this.data.playerInfo.webName,
            "elementType": 0,
            "elementTypeName": '',
            "teamId": this.data.playerInfo.teamId,
            "teamName": this.data.playerInfo.teamName,
            "teamShortName": this.data.playerInfo.teamShortName,
            "price": 0.0,
            "points": 0
          }
        }
        this.setData({
          playerInfo: playerInfo
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  getPlayerSummary() {
    get('stat/qryPlayerSummary', {
        season: this.data.season,
        code: this.data.playerInfo.code
      })
      .then(res => {
        let playerSummary = res.data;
        if (playerSummary.element === 0) {
          playerSummary = {
            "event": 0,
            "element": 0,
            "code": this.data.playerInfo.code,
            "price": 0.0,
            "elementType": 0,
            "elementTypeName": '',
            "webName": '',
            "teamId": 0,
            "teamName": '',
            "teamShortName": '',
            "eventPoints": 0,
            "detailData": {},
            "fixtureList": []
          }
        }
        this.setData({
          playerSummary: playerSummary
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  refreshPlayerSummary() {
    get('stat/refreshPlayerSummary', {
        season: this.data.season,
        code: this.data.playerInfo.code
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
        // 拉取球员数据
        this.getPlayerInfo();
        this.getPlayerSummary();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})