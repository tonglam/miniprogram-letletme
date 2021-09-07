import {
  get
} from "../../../utils/request";
import {
  showOverallRank,
  getChipName
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    entryInfoData: {},
    // 垃圾双向绑定
    entryName: "",
    liveData: {},
    noTransfers: false,
    transfersList: [],
    // pop
    popShow: false,
    // refrsh
    pullDownRefresh: false,
  },

  /**
   * 原生
   */

  onLoad: function (options) {
    let entry = 0;
    if (JSON.stringify(options) !== '{}') { // 传入要查询的entry
      entry = parseInt(options.entry);
      this.setData({
        entry: entry
      });
      this.initEntryInfo();
    } else {
      entry = app.globalData.entry;
      let entryInfoData = app.globalData.entryInfoData;
      this.setData({
        entry: entry,
        entryInfoData: entryInfoData,
        entryName: entryInfoData.entryName
      });
    }
    this.setData({
      gw: app.globalData.gw
    });
  },

  onShow: function () {
    // 拉取实时分数
    if (JSON.stringify(this.data.liveData) === '{}') {
      this.initEntryLive();
    }
    // 拉取转会数据
    if (this.data.transfersList.length === 0) {
      this.initTransfers();
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 拉取实时分数
    this.refreshEntryLive();
  },

  /**
   * 操作
   */

  // 更换team_id
  onClickChange() {
    this.setData({
      entry: "",
      popShow: true
    });
  },

  // 关闭弹出层
  onPopClose() {
    this.setData({
      entry: 0,
      popShow: false
    });
  },

  // team_id输入确认
  onClickInput() {
    console.log("input:" + this.data.entry);
    this.setData({
      popShow: false
    });
    this.initEntryInfo();
    // 拉取实时分数
    this.initEntryLive();
    // 拉取转会数据
    this.initTransfers();
  },

  /**
   * 数据
   */

  initEntryInfo() {
    get('entry/qryEntryInfo', {
        entry: this.data.entry
      })
      .then(res => {
        let entryInfoData = res.data;
        this.setData({
          entryInfoData: entryInfoData,
          entryName: entryInfoData.entryName
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 拉取entry实时得分数据
  initEntryLive() {
    let gw = this.data.gw,
      entry = this.data.entry;
    if (gw <= 0 || entry <= 0) {
      return false;
    }
    // 刷新live
    get('live/calcLivePointsByEntry', {
        event: gw,
        entry: entry
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
        // 组装数据
        let liveData = res.data;
        liveData.lastOverallRank = showOverallRank(liveData.lastOverallRank);
        liveData.chip = getChipName(liveData.chip);
        let list = [];
        liveData.pickList.forEach(element => {
          element.webName = this.setWebName(element.webName, element.captain, element.viceCaptain);
          element.style = this.setStyle(element.pickActive, element.playStatus);
          list.push(element);
        });
        liveData.pickList = list;
        this.setData({
          liveData: liveData
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  setWebName(webName, captain, viceCaptain) {
    if (captain) {
      return webName + "(c)";
    } else if (viceCaptain) {
      return webName + "(vc)";
    }
    return webName;
  },

  setStyle(pick, status) {
    if (pick) {
      switch (status) {
        case 0:
          return "pickPlaying";
        case 1:
          return "pickFinished";
        case 4:
          return "pickBlank";
        default:
          return "pickNotStart";
      }
    } else {
      switch (status) {
        case 0:
          return "unPickPlaying";
        case 1:
          return "unPickFinished";
        case 4:
          return "unPickBlank";
        default:
          return "unPickNotStart";
      }
    }
  },

  // 拉取本轮转会数据
  initTransfers() {
    get('entry/qryEntryEventTransfers', {
        event: this.data.gw,
        entry: this.data.entry
      })
      .then(res => {
        let list = res.data;
        if (list.length === 0) {
          this.setData({
            noTransfers: true
          });
        }
        this.setData({
          transfersList: list
        });
      });
  },

  // 刷新再拉取数据
  refreshEntryLive() {
    get('common/insertEventLiveCache', {
        event: this.data.gw
      }, false)
      .then(() => {
        this.initEntryLive();
      });
  },

})