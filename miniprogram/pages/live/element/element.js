import {
  get
} from "../../../utils/request";
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    gw: 0,
    season: '',
    element: 0,
    playerInfo: {},
    liveData: {},
    // picker
    playerPickerShow: false,
    // refrsh
    pullDownRefresh: false,
  },

  /**
   * 原生
   */

  onLoad: function (options) {
    this.setData({
      gw: app.globalData.gw,
      season: app.globalData.season
    });
    if (JSON.stringify(options) !== '{}') { // 传入要查询的element
      let element = parseInt(options.element);
      this.setData({
        element: element
      });
      this.initPlayerInfo();
    }
  },

  onShow: function () {
    // 拉取live
    this.initElementLive();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 拉取实时分数
    this.refreshElementLive();
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

  onPlayerPopClose() {
    this.setData({
      playerPickerShow: false
    });
  },

  onPlayerPickResult(event) {
    this.setData({
      playerPickerShow: false
    });
    let playerInfo = event.detail;
    if (playerInfo === '' || playerInfo === null) {
      return false;
    }
    // 设置
    this.setData({
      element: playerInfo.element,
      playerInfo: playerInfo,
    });
    // 拉取live
    this.initElementLive();
  },

  /**
   * 数据
   */

  initPlayerInfo() {
    get('player/qryPlayerInfoByElement', {
        season: this.data.season,
        element: this.data.element
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

  initElementLive() {
    let gw = this.data.gw,
      element = this.data.element;
    if (gw <= 0 || element <= 0) {
      return false;
    }
    get('live/calcLivePointsByElement', {
        event: gw,
        element: element
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
        this.setData({
          liveData: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  refreshElementLive() {
    get('common/insertEventLiveCache', {
        event: this.data.gw
      }, false)
      .then(() => {
        this.initElementLive();
      });
  },

})