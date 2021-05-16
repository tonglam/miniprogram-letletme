const app = getApp();

import {
  get
} from "../../../utils/request";
import {
  showOverallRank,
  getChipName
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  data: {
    gw: 0,
    entryInfoData: {},
    entry: 0,
    entryName: "",
    playerName: "",
    liveData: {},
    popShow: false,
    // refrsh
    pullDownRefresh: false,
  },

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
        entry: entryInfoData.entry,
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
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.initEntryLive();
  },

  // nav
  onClickChange() {
    this.setData({
      entry: "",
      popShow: true
    });
  },

  // pop
  onPopClose() {
    this.setData({
      entry: 0,
      popShow: false
    });
  },

  // button
  onClickInput() {
    this.setEntryInfo(this.data.entry);
    this.initEntryLive();
    this.setData({
      popShow: false
    });
  },

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

  initEntryLive() {
    let gw = this.data.gw,
      entry = this.data.entry;
    if (gw == 0 || entry == 0) {
      return false;
    }
    get('common/insertEventLiveCache', {
        event: gw
      })
      .then(() => {
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
          })
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

})