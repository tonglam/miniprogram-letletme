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
    playerName: "",
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
    if (JSON.stringify(options) !== '{}') { // 传入要查询的entry
      let entry = parseInt(options.entry);
      this.setData({
        entry: entry
      });
      this.setEntryInfo(entry);
    } else { // 全局变量取
      let entryInfoData = app.globalData.entryInfoData;
      this.setData({
        entryInfoData: entryInfoData,
        entry: app.globalData.entry,
        entryName: entryInfoData.entryName,
        playerName: entryInfoData.playerName
      });
    }
  },

  onShow: function () {
    this.setData({
      gw: app.globalData.gw
    });
    // 拉取实时分数
    this.initEntryLive();
    // 拉取转会数据
    if (!this.data.noTransfers && this.data.transfersList.length === 0) {
      this.initTransfersData();
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 拉取实时分数
    this.initEntryLive();
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
    this.setEntryInfo(this.data.entry);
    this.initEntryLive();
    this.setData({
      popShow: false
    });
  },

  /**
   * 数据
   */

  // 拉取entry实时得分数据
  initEntryLive() {
    let gw = this.data.gw,
      entry = this.data.entry;
    if (gw == 0 || entry == 0) {
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
                duration: 400,
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
  initTransfersData() {
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

  // 拉取entry_info
  setEntryInfo(entry) {
    get('entry/qryEntryInfo', {
        entry: entry
      })
      .then(res => {
        let entryInfoData = res.data;
        entryInfoData['overallRank'] = showOverallRank(entryInfoData.overallRank);
        this.setData({
          entryInfoData: entryInfoData,
          entry: entryInfoData.entry,
          entryName: entryInfoData.entryName,
          playerName: entryInfoData.playerName
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})