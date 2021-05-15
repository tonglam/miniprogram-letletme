const app = getApp();

import {
  get
} from "../../../utils/request";
import {
  compareAscSort,
  compareDescSort
} from '../../../utils/utils';

Page({

  data: {
    tabBarActive: 'playing',
    playStatus: 'playing',
    infoShow: false,
    contentShow: true,
    fixtureShow: false,
    activeNames: ['1','2','3'],
    liveMatchList: [],
    liveBonusList: [],
    liveBpsList: [],
    liveFixtureList: [],
  },

  onLoad: function () {
    this.initLiveMatch();
  },

  onPullDownRefresh: function () {
    if (this.data.playStatus === 'playing') {
      this.refreshLiveMatch();
    }
    this.initLiveMatch();
  },

  // navBar
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
    this.initLiveMatch();
  },

  // collapse-cards
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  refreshLiveMatch() {
    get('common/insertEventLive', {
        event: app.globalData.gw
      })
      .then(res => {
        this.initLiveMatch();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initLiveMatch() {
    get('live/qryLiveMatchByStatus', {
        playStatus: this.data.playStatus
      })
      .then(res => {
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
      })
  },

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

  initLiveFixture() {
    let list = this.data.liveMatchList.sort(compareAscSort("matchId"));
    this.setData({
      liveFixtureList: list
    });
  },

})