import {
  get
} from '../../../utils/request';

Page({

  data: {
    // 数据
    season: '2122',
    playerInfo: {},
    playerSummary: {},
    // picker
    playerPickerShow: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    // 取缓存
    let code = wx.getStorageSync('stat-player');
    if (code > 0) {
      this.setData({
        "playerInfo.code": code,
      });
      // 拉取球员数据
      this.getPlayerInfo();
      this.getPlayerSummary();
    } else {
      this.setData({
        playerPickerShow: true,
      });
    }
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  onClickChangePlayer() {
    this.setData({
      playerPickerShow: true
    });
  },

  // 关闭弹出层
  onPlayerPopClose() {
    this.setData({
      playerPickerShow: false
    });
  },

  // picker回调
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

  // dropDown回调
  onSeasonResult(event) {
    this.setData({
      season: event.detail
    });
    // 拉取球员数据
    this.getPlayerInfo();
    this.getPlayerSummary();
  },

  /**
   * 数据
   */

  getPlayerInfo() {
    get('stat/qryPlayerInfo', {
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

})