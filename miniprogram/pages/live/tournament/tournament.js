const app = getApp();

import {
  get
} from "../../../utils/request";
import {
  getChipName
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  data: {
    gw: 0,
    entry: {},
    showTournamentPicker: false,
    tournamentId: 0,
    tournamentName: "",
    tournamentInfoData: {},
    liveDataList: [],
    // refrsh
    pullDownRefresh: false,
    // dropdown
    sortOptions: [{
        text: "实时得分",
        value: "points"
      },
      {
        text: "实时净得分",
        value: "netPoints"
      },
      {
        text: "实时总分",
        value: "totalPoints"
      },
      {
        text: "剁手",
        value: "cost"
      }
    ],
    sortValue: "points",
    sortTypeOptions: [{
      text: "降序",
      value: "desc"
    }, {
      text: "升序",
      value: "asc"
    }],
    sortTypeValue: "desc",
    captainOptions: [],
    captainValue: "",
    chipOptions: [{
        text: "全部",
        value: "all"
      }, {

        text: "TC",
        value: "tc"
      },
      {
        text: "BB",
        value: "bb"
      },
      {
        text: "FH",
        value: "fh"
      },
      {
        text: "WC",
        value: "wc"
      }
    ],
    chipValue: "all",

  },

  onShow: function () {
    let gw = app.globalData.gw,
      entry = app.globalData.entryInfoData.entry;
    if (gw === 0 || entry === 0) {
      wx.redirectTo({
        url: '../../common/entryInput/entryInput'
      });
    }
    this.setData({
      gw: gw,
      entry: entry,
    });
    let showTournamentPicker = false;
    // 取缓存
    let tournamentId = wx.getStorageSync('tournamentId');
    if (tournamentId > 0) {
      this.setTournamentInfo(tournamentId);
    } else {
      showTournamentPicker = true;
    }
    // 设置
    this.setData({
      showTournamentPicker: showTournamentPicker
    });
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.initLiveTournament();
  },

  onShareAppMessage: function () {

  },

  onClickChange() {
    this.setData({
      showTournamentPicker: true
    });
  },

  // 赛事选择回填
  onPickTournament(event) {
    this.setData({
      showTournamentPicker: false
    });
    let data = event.detail;
    if (data === '') {
      return false;
    }
    let tournamentId = data.id,
      tournamentName = data.name;
    // 存缓存
    wx.setStorageSync('tournamentId', tournamentId);
    // 设置
    this.setData({
      tournamentId: tournamentId,
      tournamentName: tournamentName
    });
    // 刷新live
    this.initLiveTournament();
  },

  // cell
  onCellClick(event) {
    console.log("cell click:" + event)
  },

  initLiveTournament() {
    let gw = this.data.gw,
      tournamentId = this.data.tournamentId;
    if (gw <= 0 || tournamentId <= 0) {
      return false;
    }
    get('common/insertEventLiveCache', {
        event: gw
      })
      .then(() => {
        // 刷新live
        get('live/calcLivePointsByTournament', {
            event: gw,
            tournamentId: tournamentId
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
            // 更新
            let list = [];
            res.data.forEach(element => {
              element.chip = getChipName(element.chip);
              list.push(element);
            });
            this.setData({
              liveDataList: list
            });
            // 更新排序
            this.initDropDown();
          })
          .catch(res => {
            console.log('fail:', res);
          })
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  setTournamentInfo(id) {
    if (id <= 0) {
      return false;
    }
    get('tournament/qryTournamentInfoById', {
        id: id
      })
      .then(res => {
        let data = res.data
        this.setData({
          tournamentId: data.id,
          tournamentName: data.name
        });
        // 刷新live
        this.initLiveTournament();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initDropDown() {
    let captainList = [],
      nameList = [];
    this.data.liveDataList.forEach(element => {
      let captain = element.captainName;
      if (nameList.indexOf(captain) === -1) {
        let data = {};
        data["text"] = captain;
        data["value"] = captain;
        captainList.push(data);
        nameList.push(captain);
      }
    });
    this.setData({
      captainOptions: captainList,
      captainValue: captainList[0]
    });
  },

})