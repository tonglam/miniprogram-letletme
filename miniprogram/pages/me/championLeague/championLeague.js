import {
  get
} from "../../../utils/request";
import {
  getChipName
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();
let championLeagueDataFullList = [],
  championLeagueDataList = [];

Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    championLeagueId: 0,
    championLeagueName: "请选择",
    infoData: {},
    startGw: 0,
    endGw: 0,
    stage: "请选择",
    stageName: "",
    roundName: "",
    currentPage: 1,
    totalNum: 0,
    chanpionLeaguePageDataList: [],
    // picker
    showGwPicker: false,
    showChampionLeaguePicker: false,
    // refrsh
    pullDownRefresh: false,
    // 搜索
    searchEntry: "",
    // 分页
    current: 1
  },

  /**
   * 原生
   */

  onShow: function () {
    // 设置
    this.setData({
      gw: app.globalData.gw,
      startGw: app.globalData.gw,
      entry: app.globalData.entryInfoData.entry,
    });
    // 初始化
    this.initChampionLeagueConfig();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.initChampionLeagueGroup();
  },

  onReachBottom: function () {
    let currentPage = this.data.currentPage;
    if (currentPage * 10 > this.data.totalNum) {
      return false;
    }
    this.setData({
      currentPage: currentPage + 1
    });
    this.setPageData();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // 初始化联赛配置
  initChampionLeagueConfig() {
    let showChampionLeaguePicker = false;
    // 取冠军杯缓存
    let championLeagueId = wx.getStorageSync('me-championLeagueId');
    if (championLeagueId !== '' && championLeagueId > 0) {
      let championLeagueName = wx.getStorageSync('me-championLeagueName');
      this.setData({
        championLeagueId: championLeagueId,
        championLeagueName: championLeagueName
      });
      // 标题
      this.setTitle(championLeagueName)
      // 初始化阶段
      this.initChampionLeagueStageConfig();
      // 冠军杯配置
      this.initChampionLeagueInfo();
    } else {
      showChampionLeaguePicker = true; // 缓存没有时从picker中选择
      this.setData({
        showChampionLeaguePicker: showChampionLeaguePicker
      });
    }
  },

  // 初始化阶段配置
  initChampionLeagueStageConfig() {
    // 取当前经理小组缓存
    let stage = wx.getStorageSync('me-championLeagueStage');
    if (stage !== '') {
      this.setStage(stage);
      this.setData({
        championLeaguePageDataList: [],
      });
      // 刷新
      if (this.data.championLeaguePageDataList.length === 0) {
        this.initChampionLeagueGroup();
      }
    } else {
      // 拉取当前经理冠军杯小组
      this.initEntryChampionLeagueStage();
    }
  },

  // 更换比赛周
  onClickChangeGw() {
    this.setData({
      showGwPicker: true
    });
  },

  // 更换联赛
  onClickChange() {
    this.setData({
      showChampionLeaguePicker: true
    });
  },

  // 搜索框
  onSearchChange(event) {
    this.setData({
      searchEntry: event.detail,
    });
    this.datafilter();
  },

  // 冠军杯选择回填
  onPickChampionLeague(event) {
    this.setData({
      showChampionLeaguePicker: false
    });
    let data = event.detail;
    if (data === '') {
      return false;
    }
    let championLeagueId = data.id,
      championLeagueName = data.name;
    // 存缓存
    wx.setStorageSync('me-championLeagueId', championLeagueId);
    wx.setStorageSync('me-championLeagueName', championLeagueName);
    // 设置
    this.setData({
      championLeagueId: championLeagueId,
      championLeagueName: championLeagueName,
      livePageDataList: [],
    });
    // 标题
    this.setTitle(championLeagueName)
    // 初始化阶段
    this.initChampionLeagueStageConfig();
    // 冠军杯配置
    this.initChampionLeagueInfo();
    // 刷新
    this.initChampionLeagueGroup();
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
    if (gw === this.data.resultGw) {
      return false;
    }
    this.setData({
      resultGw: gw
    });
    // 更新得分数据
    this.initChampionLeagueGroup();
  },

  // 过滤数据
  datafilter() {
    this.setData({
      currentPage: 1,
      championLeaguePageDataList: []
    });
    championLeagueDataList = this.searchList(championLeagueDataFullList);
    // 分页
    this.setPageData();
  },

  // 搜索
  searchList(fullList) {
    let list = [],
      search = this.data.searchEntry.toLowerCase();
    if (search === '') {
      return fullList;
    }
    fullList.forEach(element => {
      let entryName = (element.entryName + '').toLowerCase()
      if (entryName.includes(search) > 0) {
        list.push(element);
      }
    });
    return list;
  },

  // 分页数据
  setPageData() {
    let currentPage = this.data.currentPage,
      list = [];
    for (let index = 1; index < championLeagueDataList.length + 1; index++) {
      let start = 10 * (currentPage - 1) + 1,
        end = 10 * currentPage;
      if (index < start || index > end) {
        continue;
      }
      list.push(championLeagueDataList[index - 1]);
    }
    let key = 'championLeaguePageDataList[' + (currentPage - 1) + ']';
    this.setData({
      [key]: list
    });
  },

  // 设置标题
  setTitle(championLeagueName) {
    wx.setNavigationBarTitle({
      title: championLeagueName
    });
  },

  // 设置stage
  setStage(stage) {
    let index = stage.indexOf("-"),
      stageName = stage.substring(0, index),
      roundName = stage.substring(index + 1, stage.length);
    this.setData({
      stage: stage,
      stageName: stageName,
      roundName: roundName
    });
  },

  // 分页
  handleChange({
    detail
  }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        current: this.data.current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        current: this.data.current - 1
      });
    }
  },

  /**
   * 数据
   */

  // 拉取冠军杯配置
  initChampionLeagueInfo() {
    get('tournament/qryTournamentInfo', {
        id: this.data.championLeagueId
      }, false)
      .then((res) => {
        let data = res.data,
          startGw = 0,
          endGw = 0;
        // startGw
        if (data.groupStartGw !== '') {
          startGw = parseInt(data.groupStartGw);
        } else {
          startGw = parseInt(data.knockoutStartGw);
        }
        // endGw
        if (data.groupEndGw !== '') {
          endGw = parseInt(data.groupEndGw);
        } else {
          endGw = parseInt(data.knockoutEndGw);
        }
        this.setData({
          infoData: data,
          startGw: startGw,
          endGw: endGw
        });
      });
  },

  // 拉取冠军杯分数
  initChampionLeagueGroup() {
    get('', {
        event: this.data.gw,
        tournamentId: this.data.championLeagueId,
        stage: this.data.stage
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
        if (res.data.length === 0) {
          return false;
        }
        // 更新
        let list = [];
        res.data.forEach(element => {
          element.chip = getChipName(element.chip);
          list.push(element);
        });
        championLeagueDataFullList = list;
        this.setData({
          totalNum: list.length
        });
        // 过滤数据
        this.datafilter();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 刷新再拉取数据
  refreshChampionLeagueGroup() {
    get('common/insertEventLive', {
        event: this.data.gw
      }, false)
      .then(() => {
        this.initChampionLeagueGroup();
      });
  },

  // 拉取当前经理冠军杯小组
  initEntryChampionLeagueStage() {
    let entry = this.data.entry,
      tournamentId = this.data.championLeagueId;
    if (entry <= 0 || tournamentId <= 0) {
      return false;
    }
    get('tournament/qryEntryChampionLeagueStage', {
        entry: entry,
        tournamentId: tournamentId
      }, false)
      .then((res) => {
        let stage = res.data;
        if (stage !== '') {
          // 存缓存
          wx.setStorageSync('me-championLeagueStage', stage);
          // 设置
          this.setData({
            stage: stage
          });
        }
      });
  },

})