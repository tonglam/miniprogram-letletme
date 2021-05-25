import {
  get
} from "../../../utils/request";
import {
  compareAscSort,
  compareDescSort
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 数据
    gw: 0,
    playStatus: 'playing',
    infoShow: false,
    contentShow: true,
    fixtureShow: false,
    liveMatchList: [],
    activeMatchNames: [],
    liveBonusList: [],
    activeBonusNames: [],
    liveBpsList: [],
    activeBpsNames: [],
    liveFixtureList: [],
    // match details
    liveDetailsList: [],
    activeDetailsNames: [],
    // tarBar
    tabBarActive: 'playing',
    // refrsh
    pullDownRefresh: false,
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

  // 比赛状态标签页切换
  onNavBarChange(event) {
    let status = event.detail.name;
    if (status === 'not_start' || status === 'next_event') {
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
      playStatus: status,
      infoShow: false,
      liveMatchList: [],
      liveBonusList: [],
      liveBpsList: [],
      liveFixtureList: [],
      liveDetailsList: []
    });
    // 拉取对应比赛状态的数据
    this.initLiveMatch();
  },

  // 折叠面板切换
  onMatchChange(event) {
    this.setData({
      activeMatchNames: event.detail,
    });
  },

  onBounusChange(event) {
    this.setData({
      activeBonusNames: event.detail,
    });
  },

  onBpsChange(event) {
    this.setData({
      activeBpsNames: event.detail,
    });
  },

  onDetailsChange(event) {
    this.setData({
      activeDetailsNames: event.detail,
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
        let list = res.data;
        if (list.length === 0) {
          this.setData({
            infoShow: true
          });
          return false;
        }
        // 设置
        this.setData({
          infoShow: false,
          liveMatchList: list
        });
        this.initLiveBonus();
        this.initLiveBps();
        this.initLiveDetails();
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

  // 组装比赛详情数据
  initLiveDetails() {
    let list = [];
    this.data.liveMatchList.forEach(element => {
      let data = this.initMatchBaseInfo(element);
      let goalsList = [],
        assistsList = [],
        ownGoalsList = [],
        penaltiesSavedList = [],
        penaltiesMissedList = [],
        yellowCardsList = [],
        redCardsList = [],
        savesList = [];
      element.homeTeamDataList.forEach(object => {
        if (object.goalsScored > 0) {
          goalsList.push(object);
        }
        if (object.assists > 0) {
          assistsList.push(object);
        }
        if (object.ownGoals > 0) {
          ownGoalsList.push(object);
        }
        if (object.penaltiesSaved > 0) {
          penaltiesSavedList.push(object);
        }
        if (object.penaltiesMissed > 0) {
          penaltiesMissedList.push(object);
        }
        if (object.yellowCards > 0) {
          yellowCardsList.push(object);
        }
        if (object.redCards > 0) {
          redCardsList.push(object);
        }
        if (object.saves > 0) {
          savesList.push(object);
        }
      });
      element.awayTeamDataList.forEach(object => {
        if (object.goalsScored > 0) {
          goalsList.push(object);
        }
        if (object.assists > 0) {
          assistsList.push(object);
        }
        if (object.ownGoals > 0) {
          ownGoalsList.push(object);
        }
        if (object.penaltiesSaved > 0) {
          penaltiesSavedList.push(object);
        }
        if (object.penaltiesMissed > 0) {
          penaltiesMissedList.push(object);
        }
        if (object.yellowCards > 0) {
          yellowCardsList.push(object);
        }
        if (object.redCards > 0) {
          redCardsList.push(object);
        }
        if (object.saves > 0) {
          savesList.push(object);
        }
      });
      data.goals = goalsList;
      data.assists = assistsList;
      data.ownGoals = ownGoalsList;
      data.penaltiesSaved = penaltiesSavedList;
      data.penaltiesMissed = penaltiesMissedList;
      data.yellowCards = yellowCardsList;
      data.redCards = redCardsList;
      data.saves = savesList;
      list.push(data);
    });
    this.setData({
      liveDetailsList: list
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