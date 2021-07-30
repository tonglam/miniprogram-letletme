import {
  get
} from '../../../utils/request';

Page({

  data: {
    // 数据
    season:'2021',
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
    let element = wx.getStorageSync('stat-element');
    if (element > 0) {
      this.setData({
        "playerInfo.element": element,
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

  onClickChange() {
    this.setData({
      playerPickerShow: true
    });
  },

  // 关闭弹出层
  onModePopClose() {
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
    console.log(playerInfo);
    if (playerInfo === '' || playerInfo === null) {
      return false;
    }
    // 存缓存
    wx.setStorageSync('stat-element', playerInfo.element);
    // 设置
    this.setData({
      playerInfo: playerInfo,
    });
    // 拉取球员数据
    this.getPlayerSummary();
  },

  /**
   * 数据
   */

  getPlayerInfo() {
    get('player/qryPlayerInfoByElement', {
        element: this.data.playerInfo.element
      })
      .then(res => {
        this.setData({
          playerInfo: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  getPlayerSummary() {
    get('player/qryPlayerSummaryByElement', {
        element: this.data.playerInfo.element
      })
      .then(res => {
        this.setData({
          playerSummary: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})