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
    // 数据
    gw: app.globalData.gw,
    entry: app.globalData.entryInfoData.entry,
    tournamentId: 0,
    tournamentName: "",
    tournamentInfoData: {},
    liveDataList: [],
    // picker
    showTournamentPicker: false,
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

  /**
   * 原生
   */

  onShow: function () {
    let showTournamentPicker = false;
    // 取缓存
    let tournamentId = wx.getStorageSync('tournamentId');
    if (tournamentId > 0) {
      this.setTournamentInfo(tournamentId);
    } else {
      showTournamentPicker = true; // 缓存没有时从picker中选择
    }
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

  /**
   * 操作
   */

  // 更换联赛
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

  /**
   * 数据
   */
  initLiveTournament() {
    get('live/calcLivePointsByTournament', {
      event: this.data.gw,
      tournamentId: this.data.tournamentId
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
      });
  },

  // 组装下拉选项
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

  // 刷新再拉取数据
  refreshLiveTournament() {
    get('common/insertEventLiveCache', {
      event: gw
    }, false)
      .then(() => {
        this.initLiveTournament();
      });
  },

  // 拉取tournament_info
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

})