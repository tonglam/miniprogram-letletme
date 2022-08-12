import {
  get
} from "../../../utils/request";

const app = getApp();

Page({

  data: {
    gw: 0,
    season: '',
    source: 'Overall',
    dataList: [],
    data: {},
    average: 0,
    // picker
    scouts: [],
    showScoutPicker: false,
    showGwPicker: false,
    // refrsh
    pullDownRefresh: false,
    // uploader
    fileList: [],
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      gw: app.globalData.gw
    });
    // 拉取所有推荐渠道
    this.initAllPopularScoutSource();
    // 拉取数据
    if (this.data.source === 'Overall') {
      this.initOverallEventScoutResult();
    } else {
      this.initEventSourceScoutResult();
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.refreshEventSourceScoutResult();
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

  // 更换球探
  onClickChangeScout() {
    this.setData({
      showScoutPicker: true
    });
  },

  // 关闭弹出层
  onScoutPopClose() {
    this.setData({
      showScoutPicker: false
    });
  },

  // picker确认
  onScoutPickerConfirm(event) {
    let source = event.detail.value;
    this.setData({
      showScoutPicker: false,
      source: source,
      pullDownRefresh: false
    });
    // 拉取数据
    if (source === 'Overall') {
      this.initAllPopularScoutSource();
    } else {
      this.initEventSourceScoutResult();
    }
  },

  // picker取消
  onScoutPickerCancel() {
    this.setData({
      showScoutPicker: false
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

  /**
   * 数据
   */

  // 获取所有推荐渠道
  initAllPopularScoutSource() {
    get('common/qryAllPopularScoutSource', false)
      .then(res => {
        let scouts = res.data;
        this.setData({
          scouts: scouts
        });
      });
  },

  // 获取渠道比赛周结果
  initEventSourceScoutResult() {
    get('summary/qryEventSourceScoutResult', {
        event: this.data.gw,
        source: this.data.source
      }, false)
      .then(res => {
        let data = res.data;
        this.setData({
          data: data,
          average: data.averagePoints
        });
      });
  },

  // 获取所有比赛周结果
  initOverallEventScoutResult() {
    get('summary/qryOverallEventScoutResult', {
        event: this.data.gw
      }, false)
      .then(res => {
        let dataList = res.data;
        this.setData({
          dataList: dataList,
          average: dataList[0].averagePoints
        });
        console.log(dataList);
      });
  },

  // 刷新比赛周数据
  refreshEventSourceScoutResult() {
    get('summary/refreshEventSourceScoutResult', {
        event: this.data.gw
      }, false)
      .then(() => {
        if (this.data.source == 'Overall') {
          this.initOverallEventScoutResult();
        } else {
          this.initEventSourceScoutResult();
        }
      });
  },

})