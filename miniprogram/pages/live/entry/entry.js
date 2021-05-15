const app = getApp();
const chipName = {
  "n/a": "无",
  "bboost": "BB",
  "freehit": "FH",
  "wildcard": "WC",
  "3xc": "3C"
};

import {
  get
} from "../../../utils/request";
import {
  showOverallRank
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  data: {
    gw: 0,
    entry: 0,
    entryName: "",
    playerName: "",
    liveData: {},
    popShow: false,
  },

  onShow: function () {
    this.setData({
      gw: app.globalData.gw,
      entryInfoData: app.globalData.entryInfoData,
      entryName: app.globalData.entryInfoData.entryName,
      playerName: app.globalData.entryInfoData.playerName
    });
    // 拉取实时分数
    this.initEntryLive();
  },

  // nav
  onClickRefresh() {
    this.refreshLiveMatch();
    this.initEntryLive();
  },

  onClickChange() {
    this.setData({
      entry: "",
      popShow: true
    });
  },

  // pop
  onPopClose() {
    this.setData({
      entry:0,
      popShow: false
    });
  },

  // button
  onClickInput() {
    this.setEntryInfo();
    this.initEntryLive();
    this.setData({
      popShow: false
    });
  },

  initEntryLive() {
    let entry = this.data.entry;
    if (entry === 0) {
      entry = app.globalData.entryInfoData.entry;
    }
    console.log("entry: " + entry)
    if (entry === 0 || entry === '') {
      Toast.fail('输入team_id');
      wx.redirectTo({
        url: '../../common/entryInput/entryInput'
      });
    }
    get('live/calcLivePointsByEntry', {
        event: this.data.gw,
        entry: entry
      })
      .then(res => {
        let liveData = res.data;
        liveData.chip = chipName[liveData.chip];
        let list = [];
        liveData.pickList.forEach(element => {
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

  setEntryInfo() {
    get('entry/qryEntryInfo', {
        entry: this.data.entry
      })
      .then(res => {
        let entryInfoData = res.data;
        entryInfoData['overallRank'] = showOverallRank(entryInfoData.overallRank);
        this.setData({
          entryInfoData: entryInfoData,
          entryName: entryInfoData.entryName,
          playerName: entryInfoData.playerName
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  refreshLiveMatch() {
    get('common/insertEventLive', {
        event: app.globalData.gw
      })
      .then(() => {
        this.initLiveMatch();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})