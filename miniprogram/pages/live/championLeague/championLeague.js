import {
  get
} from "../../../utils/request";
import {
  getChipName
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();
let liveDataFullList = [],
  liveDataList = [];

Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    championLeagueId: 0,
    championLeagueName: "请选择",
    infoData: {},
    stage: "请选择",
    stageName: "",
    roundName: "",
    currentPage: 1,
    totalNum: 0,
    livePageDataList: [],
    groupShow: false,
    qualificationShow: false,
    knockoutShow: false,
    // picker
    showChampionLeaguePicker: false,
    showChampionLeagueStagePicker: false,
    // refrsh
    pullDownRefresh: false,
    // 搜索
    searchEntry: "",
    // dropdown
    gwOptions: [],
    gwValue: '',
    sortOptions: [{
      text: '总得分',
      value: 'liveTotalPoints'
    }, {
      text: '周得分',
      value: 'liveNetPoints'
    }],
    sortValue: 'liveTotalPoints',
  },

  /**
   * 原生
   */

  onShow: function () {
    // 设置
    this.setData({
      gw: app.globalData.gw,
      gwValue: app.globalData.gw,
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
    let stageName = this.data.stageName;
    if (stageName.indexOf('小组赛') == 0) {
      this.refreshLiveChampionLeagueGroup();
    } else if (stageName.indexOf('淘汰赛') == 0) {
      this.refreshLiveChampionLeagueKnockout();
    }
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
    let championLeagueId = wx.getStorageSync('live-championLeagueId');
    if (championLeagueId !== '' && championLeagueId > 0) {
      let championLeagueName = wx.getStorageSync('live-championLeagueName');
      this.setData({
        championLeagueId: championLeagueId,
        championLeagueName: championLeagueName
      });
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
    let stage = wx.getStorageSync('live-championLeagueStage');
    if (stage !== '') {
      this.setStage(stage);
      this.setData({
        livePageDataList: [],
      });
      // 刷新live
      if (stage.indexOf('小组赛') == 0) {
        // 刷新live
        let sortValue = this.data.sortValue;
        if (sortValue === 'liveNetPoints') {
          this.initLiveGwChampionLeagueGroup();
        } else if (sortValue === 'liveTotalPoints') {
          this.initLiveTotalChampionLeagueGroup();
        }
        this.setData({
          groupShow: true,
          qualificationShow: false,
          knockoutShow: false
        });
      } else if (stage.indexOf('晋级名单') == 0) {
        // 获取晋级名单
        this.initChampionLeagueGroupQualifications();
        this.setData({
          groupShow: false,
          qualificationShow: true,
          knockoutShow: false
        });
      } else if (stage.indexOf('淘汰赛') == 0) {
        let startIndex = stage.indexOf('第') + 1,
          endIndex = stage.indexOf('轮');
        let round = parseInt(stage.substring(startIndex, endIndex));
        this.initChampionLeagueStageKnockoutRound(round);
        this.setData({
          groupShow: false,
          qualificationShow: false,
          knockoutShow: true
        });
      }
    } else {
      // 拉取当前经理冠军杯小组
      this.initEntryChampionLeagueStage();
    }
  },

  // 重置
  onClickGroup() {
    this.setData({
      showChampionLeagueStagePicker: true
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
    let stageName = this.data.stageName,
      searchName = event.detail;
    this.setData({
      searchEntry: searchName,
    });
    if (stageName.indexOf('小组赛') == 0) {
      this.datafilter();
    } else if (stageName.indexOf('淘汰赛') == 0) {
      let list = [];
      if (searchName === '') {
        list = liveDataFullList;
      } else {
        liveDataFullList.forEach(elementList => {
          let keep = false;
          elementList.forEach(element => {
            let homeEntryName = (element.homeEntryName + '').toLowerCase(),
              awayEntryName = (element.awayEntryName + '').toLowerCase();
            if (homeEntryName.includes(searchName.toLowerCase()) > 0 || awayEntryName.includes(searchName.toLowerCase()) > 0) {
              keep = true;
            }
          });
          if (keep) {
            list.push(elementList);
          }
        });
      }
      this.setData({
        livePageDataList: list
      });
    }
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
    wx.setStorageSync('live-championLeagueId', championLeagueId);
    wx.setStorageSync('live-championLeagueName', championLeagueName);
    // 设置
    this.setData({
      championLeagueId: championLeagueId,
      championLeagueName: championLeagueName,
      livePageDataList: [],
    });
    // 初始化阶段
    this.initChampionLeagueStageConfig();
    // 冠军杯配置
    this.initChampionLeagueInfo();
    // 刷新live
    if (stage.indexOf('小组赛') == 0) {
      // 刷新live
      let sortValue = this.data.sortValue;
      if (sortValue === 'liveNetPoints') {
        this.initLiveGwChampionLeagueGroup();
      } else if (sortValue === 'liveTotalPoints') {
        this.initLiveTotalChampionLeagueGroup();
      }
      this.setData({
        groupShow: true,
        qualificationShow: false,
        knockoutShow: false
      });
    } else if (stage.indexOf('晋级名单') == 0) {
      // 获取晋级名单
      this.initChampionLeagueGroupQualifications();
      this.setData({
        groupShow: false,
        qualificationShow: true,
        knockoutShow: false
      });
    } else if (stage.indexOf('淘汰赛') == 0) {
      let startIndex = stage.indexOf('第') + 1,
        endIndex = stage.indexOf('轮');
      let round = parseInt(stage.substring(startIndex, endIndex));
      this.initChampionLeagueStageKnockoutRound(round);
      this.setData({
        groupShow: false,
        qualificationShow: false,
        knockoutShow: true
      });
    }
  },

  // 冠军杯小组选择回填
  onPickChampionLeagueStage(event) {
    this.setData({
      showChampionLeagueStagePicker: false
    });
    let data = event.detail;
    if (data === '') {
      return false;
    }
    let stage = data + '';
    if (stage.indexOf('晋级') === 0) {
      stage = '晋级名单';
    }
    // 存缓存
    wx.setStorageSync('live-championLeagueStage', stage);
    // 设置
    this.setStage(stage);
    // 分阶段
    if (stage.indexOf('小组赛') == 0) {
      // 刷新live
      let sortValue = this.data.sortValue;
      if (sortValue === 'liveNetPoints') {
        this.initLiveGwChampionLeagueGroup();
      } else if (sortValue === 'liveTotalPoints') {
        this.initLiveTotalChampionLeagueGroup();
      }
      this.setData({
        groupShow: true,
        qualificationShow: false,
        knockoutShow: false
      });
    } else if (stage.indexOf('晋级名单') == 0) {
      // 获取晋级名单
      this.initChampionLeagueGroupQualifications();
      this.setData({
        groupShow: false,
        qualificationShow: true,
        knockoutShow: false
      });
    } else if (stage.indexOf('淘汰赛') == 0) {
      let startIndex = stage.indexOf('第') + 1,
        endIndex = stage.indexOf('轮');
      let round = parseInt(stage.substring(startIndex, endIndex));
      this.initChampionLeagueStageKnockoutRound(round);
      this.setData({
        groupShow: false,
        qualificationShow: false,
        knockoutShow: true
      });
    }
  },

  // 过滤数据
  datafilter() {
    this.setData({
      currentPage: 1,
      livePageDataList: []
    });
    liveDataList = this.searchList(liveDataFullList);
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
    for (let index = 1; index < liveDataList.length + 1; index++) {
      let start = 10 * (currentPage - 1) + 1,
        end = 10 * currentPage;
      if (index < start || index > end) {
        continue;
      }
      list.push(liveDataList[index - 1]);
    }
    let key = 'livePageDataList[' + (currentPage - 1) + ']';
    this.setData({
      [key]: list
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

  // 初始化周下拉
  setGwDropdown(gwValue) {
    let groupStartGw = parseInt(this.data.infoData.groupStartGw),
      groupEndGw = parseInt(this.data.infoData.groupEndGw);
    if (gwValue < groupStartGw) {
      gwValue = groupStartGw;
    } else if (gwValue > groupEndGw) {
      gwValue = groupEndGw;
    }
    let options = [{
      text: 'GW' + gwValue,
      value: gwValue
    }];
    for (let i = groupStartGw; i <= gwValue; i++) {
      if (i == gwValue) {
        continue;
      }
      options.push({
        text: 'GW' + i,
        value: i
      });
    }
    this.setData({
      gwOptions: options,
      gwValue: gwValue
    });
    let stage = this.data.stage;
    if (stage.indexOf('小组赛') == 0) {
      // 刷新live
      let sortValue = this.data.sortValue;
      if (sortValue === 'liveNetPoints') {
        this.initLiveGwChampionLeagueGroup();
      } else if (sortValue === 'liveTotalPoints') {
        this.initLiveTotalChampionLeagueGroup();
      }
      this.setData({
        groupShow: true,
        qualificationShow: false,
        knockoutShow: false
      });
    } else if (stage.indexOf('晋级名单') == 0) {
      // 获取晋级名单
      this.initChampionLeagueGroupQualifications();
      this.setData({
        groupShow: false,
        qualificationShow: true,
        knockoutShow: false
      });
    } else if (stage.indexOf('淘汰赛') == 0) {
      let startIndex = stage.indexOf('第') + 1,
        endIndex = stage.indexOf('轮');
      let round = parseInt(stage.substring(startIndex, endIndex));
      this.initChampionLeagueStageKnockoutRound(round);
      this.setData({
        groupShow: false,
        qualificationShow: false,
        knockoutShow: true
      });
    }
  },

  // dropDown选择
  onDropDownGw(event) {
    let oldGwValue = this.data.gwValue,
      gwValue = event.detail;
    if (oldGwValue === gwValue) {
      return false;
    }
    this.setData({
      gwValue: gwValue
    });
    this.datafilter();
    this.setGwDropdown(gwValue);
  },

  onDropDownSortValue(event) {
    let oldSortValue = this.data.sortValue,
      sortValue = event.detail;
    if (oldSortValue === sortValue) {
      return false;
    }
    this.setData({
      sortValue: sortValue
    });
    if (sortValue === 'liveNetPoints') {
      this.initLiveGwChampionLeagueGroup();
    } else if (sortValue === 'liveTotalPoints') {
      this.initLiveTotalChampionLeagueGroup();
    }
  },

  // 设置单元格样式
  setStyle(rank, qualifiers) {
    rank = parseInt(rank), qualifiers = parseInt(qualifiers);
    if (qualifiers === NaN || qualifiers === 'undefined' || qualifiers === 0) {
      return false;
    }
    if (rank > qualifiers) {
      return 'unqualified';
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
        let data = res.data;
        this.setData({
          infoData: data
        });
        // 初始化周下拉
        this.setGwDropdown(this.data.gw);
      });
  },

  // 拉取实时冠军杯小组赛周得分
  initLiveGwChampionLeagueGroup() {
    get('live/calcLiveGwPointsByChampionLeagueGroup', {
        event: this.data.gwValue,
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
        liveDataFullList = list;
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

  // 刷新再拉取小组赛数据
  refreshLiveChampionLeagueGroup() {
    get('common/insertEventLiveCache', {
        event: this.data.gw
      }, false)
      .then(() => {
        this.initLiveGwChampionLeagueGroup();
      });
  },

  // 刷新再拉取淘汰赛数据
  refreshLiveChampionLeagueKnockout() {
    get('common/insertEventLiveCache', {
        event: this.data.gw
      }, false)
      .then(() => {
        let stage = this.data.stage,
          startIndex = stage.indexOf('第') + 1,
          endIndex = stage.indexOf('轮'),
          round = parseInt(stage.substring(startIndex, endIndex));
        this.initChampionLeagueStageKnockoutRound(round);
      });
  },

  // 拉取实时冠军杯总得分
  initLiveTotalChampionLeagueGroup() {
    get('live/calcLiveTotalPointsByChampionLeagueGroup', {
        event: this.data.gwValue,
        tournamentId: this.data.championLeagueId,
        stage: this.data.stage
      })
      .then(res => {
        if (res.data.length === 0) {
          return false;
        }
        // 更新
        let list = [],
          qualifiers = this.data.infoData.groupQualifiers;
        res.data.forEach(element => {
          element.chip = getChipName(element.chip);
          element.style = this.setStyle(element.rank, qualifiers);
          list.push(element);
        });
        liveDataFullList = list;
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
          wx.setStorageSync('live-championLeagueStage', stage);
          // 设置
          this.setData({
            stage: stage
          });
        }
      });
  },

  // 拉取晋级名单
  initChampionLeagueGroupQualifications() {
    get('tournament/qryChampionLeagueGroupQualifications', {
        tournamentId: this.data.championLeagueId,
      })
      .then(res => {
        if (res.data.length === 0) {
          return false;
        }
        let list = res.data;
        this.setData({
          livePageDataList: list
        });
      })
  },

  // 拉取淘汰赛结果
  initChampionLeagueStageKnockoutRound(round) {
    get('tournament/qryChampionLeagueStageKnockoutRound', {
        tournamentId: this.data.championLeagueId,
        round: round
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
        let list = res.data;
        liveDataFullList = list;
        this.setData({
          livePageDataList: list
        });
      })
  }

})