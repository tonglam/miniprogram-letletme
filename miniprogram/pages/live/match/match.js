const app = getApp();

import {
  get
} from "../../../utils/request";
import {
  compareAscSort,
  compareDescSort
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  data: {
    // 数据
    gw: 0,
    infoShow: false,
    contentShow: true,
    fixtureShow: false,
    liveMatchList: [],
    liveBonusList: [],
    liveBpsList: [],
    liveFixtureList: [],
    playStatus: 'playing',
    // tarBar
    tabBarActive: 'playing',
    activeNames: ['1', '2', '3'],
    // refrsh
    pullDownRefresh: false
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      gw: app.globalData.gw
    });
    this.initLiveMatch();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.refreshLiveMatch();
  },

  /**
   * 操作
   */

  //比赛状态标签页切换
  navBarOnChange(event) {
    let status = event.detail.name;
    if (status === 'not_start') {
      this.setData({
        contentShow: false,
        fixtureShow: true
      });
    } else {
      this.setData({
        contentShow: true,
        fixtureShow: false
      });
    }
    this.setData({
      tabBarActive: status,
      playStatus: status
    });
    // 拉取对应比赛状态的数据
    this.initLiveMatch();
  },

  // 折叠面板切换
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  /**
   * 数据
   */

  // 实时比赛数据
  initLiveMatch() {
    get('live/qryLiveMatchByStatus', {
      playStatus: this.data.playStatus
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
            },
          });
        }
        // 组装数据
        let list = res.data,
          infoShow = false;
        if (list.length === 0) {
          infoShow = true
        }
        this.setData({
          infoShow: infoShow,
          liveMatchList: list
        });
        this.initLiveBonus();
        this.initLiveBps();
        this.initLiveFixture();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 组装bonus数据
  initLiveBonus() {
    let list = [];
    this.data.liveMatchList.forEach(element => {
      let data = this.initMatchBaseInfo(element);
      let dataList = [];
      element.homeTeamDataList.forEach(home => {
        if (home.bonus > 0) {
          dataList.push(home);
        };
      });
      element.awayTeamDataList.forEach(away => {
        if (away.bonus > 0) {
          dataList.push(away);
        };
      });
      dataList = dataList.sort(compareDescSort("bonus"))
      data.list = dataList;
      list.push(data);
    });
    this.setData({
      liveBonusList: list
    });
  },

  // 组装bps数据
  initLiveBps() {
    let list = [];
    this.data.liveMatchList.forEach(element => {
      let data = this.initMatchBaseInfo(element);
      let dataList = [];
      element.homeTeamDataList.forEach(object => {
        dataList.push(object);
      });
      element.awayTeamDataList.forEach(object => {
        dataList.push(object);
      });
      dataList = dataList.sort(compareDescSort("bps")).slice(0, 6);
      data.list = dataList;
      list.push(data);
    });
    this.setData({
      liveBpsList: list
    });
  },

  // 组装fixture数据
  initLiveFixture() {
    let list = this.data.liveMatchList.sort(compareAscSort("matchId"));
    this.setData({
      liveFixtureList: list
    });
  },

  // 组装基础数据
  initMatchBaseInfo(element) {
    let data = {};
    data.matchId = element.matchId;
    data.minutes = element.minutes;
    data.homeTeamId = element.homeTeamId;
    data.homeTeamName = element.homeTeamName;
    data.homeTeamShortName = element.homeTeamShortName;
    data.homeScore = element.homeScore;
    data.awayTeamId = element.awayTeamId;
    data.awayTeamName = element.awayTeamName;
    data.awayTeamShortName = element.awayTeamShortName;
    data.awayScore = element.awayScore;
    data.kickoffTime = element.kickoffTime;
    return data;
  },

  // 刷新再拉取数据
  refreshLiveMatch() {
    get('common/insertEventLiveCache', {
      event: this.data.gw
    }, false)
      .then(() => {
        this.initLiveMatch();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})