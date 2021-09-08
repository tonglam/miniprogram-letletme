import {
  get
} from "../../../utils/request";

const app = getApp();

Page({

  data: {
    gw: 0,
    element: 0,
    resultData: {},
    // picker
    playerPickerShow: false,
  },

  /**
   * 原生
   */

  onLoad: function (options) {
    this.setData({
      gw: app.globalData.gw
    });
    if (JSON.stringify(options) !== '{}') { // 传入要查询的element
      let element = parseInt(options.element);
      this.setData({
        element: element
      });
    }
  },

  onShow: function () {
    // 拉取数据
    this.initEventExplainResult();
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
      element: playerInfo.element
    });
    // 拉取数据
    this.initEventExplainResult();
  },

  /**
   * 数据
   */

  initEventExplainResult() {
    let gw = this.data.gw,
      element = this.data.element;
    if (gw <= 0 || element <= 0) {
      return false;
    }
    get('stat/qryElementEventExplainResult', {
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
          resultData: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})