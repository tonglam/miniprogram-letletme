import {
  get
} from "../../../utils/request";
import {
  getChipName
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();
let tournamentResultFullList = [],
  tournamentResultList = [];

Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    tournamentId: 0,
    tournamentName: "",
    currentPage: 1,
    totalNum: 0,
    tournamentPageResultList: [],
    championList: [],
    runnerUpList: [],
    secondRunnerUpList: [],
    championCountList: [],
    // picker
    showGwPicker: false,
    showTournamentPicker: false,
    showModePicker: false,
    showPlayerPicker: false,
    modes: ['选择球员', '清空选择'],
    // dropdown
    sortOptions: [{
        text: '总分',
        value: 'overallPoints'
      }, {
        text: '周得分',
        value: 'points'
      },
      {
        text: '周净得分',
        value: 'netPoints'
      },
      {
        text: '剁手',
        value: 'transferCost'
      },
      {
        text: '股价',
        value: 'value'
      },
      {
        text: '存款',
        value: 'bank'
      }
    ],
    sortValue: 'overallPoints',
    sortTypeOptions: [{
      text: '降序',
      value: 'desc'
    }, {
      text: '升序',
      value: 'asc'
    }],
    sortTypeValue: 'desc',
    captainOptions: [],
    captainValue: '',
    captainNameValue: '全部',
    chipOptions: [{
        text: '全部',
        value: '全部'
      }, {
        text: '无开卡',
        value: '无'
      }, {

        text: '3C',
        value: '3C'
      },
      {
        text: 'BB',
        value: 'BB'
      },
      {
        text: 'FH',
        value: 'FH'
      },
      {
        text: 'WC',
        value: 'WC'
      }
    ],
    chipValue: '全部',
    // 搜索
    searchElement: 0,
    searchWebName: ''
  },

  /**
   * 原生
   */

  onShow: function () {
    // 设置
    this.setData({
      gw: app.globalData.gw,
      entry: app.globalData.entryInfoData.entry,
    });
    let showTournamentPicker = false;
    // 取缓存
    let tournamentId = wx.getStorageSync('me-tournamentId');
    if (tournamentId > 0) {
      let tournamentName = wx.getStorageSync('me-tournamentName');
      this.setData({
        tournamentId: tournamentId,
        tournamentName: tournamentName
      });
      // 拉取数据
      if (this.data.tournamentPageResultList.length === 0) {
        this.initDataList();
      }
    } else {
      showTournamentPicker = true; // 缓存没有时从picker中选择
    }
    this.setData({
      showTournamentPicker: showTournamentPicker
    });
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

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.refreshTournamentResult();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // 更换GW
  onClickChangeGw() {
    this.setData({
      showGwPicker: true
    });
  },

  // 更换联赛
  onClickChangeTournament() {
    this.setData({
      showTournamentPicker: true
    });
  },

  // pop
  onModePopClose() {
    this.setData({
      showModePicker: false
    });
  },

  // 标签页切换
  tabOnChange(event) {
    let name = event.detail.name;
    if (name === 'table') {
      // 拉取积分榜数据
      if (this.data.championList.length === 0) {
        this.initEventChampionList();
      }
    } else if (name === 'result') {
      // 拉取tournament数据
      if (this.data.tournamentPageResultList.length === 0) {
        this.initTournamentResult();
      }
    } else if (name === 'me') {

    }
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
    if (gw === this.data.gw) {
      return false;
    }
    this.setData({
      gw: gw
    });
    // 拉取数据
    this.initDataList();
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
    wx.setStorageSync('me-tournamentId', tournamentId);
    wx.setStorageSync('me-tournamentName', tournamentName);
    // 设置
    this.setData({
      tournamentId: tournamentId,
      tournamentName: tournamentName
    });
    // 拉取数据
    this.initDataList();
  },

  // 搜索模式picker确认
  onModePickerConfirm(event) {
    let mode = event.detail.value;
    if (mode === '选择球员') {
      this.setData({
        showModePicker: false,
        showPlayerPicker: true
      });
    } else if (mode === '清空选择') {
      this.setData({
        showModePicker: false,
        searchElement: 0,
        searchWebName: ''
      });
      // 拉取tournament数据
      this.initTournamentResult();
    }
  },

  // 搜索模式picker取消
  onModePickerCancel() {
    this.setData({
      showModePicker: false
    });
  },

  // 球员选择回填
  onPickPlayer(event) {
    this.setData({
      showPlayerPicker: false
    });
    let element = event.detail.element,
      webName = event.detail.webName;
    if (element === 0 || webName === '') {
      return false;
    }
    this.setData({
      searchElement: element,
      searchWebName: webName
    });
    this.initTournamentSearchResult();
  },

  // dropDown选择
  onDropDownSortValue(event) {
    let oldSortValue = this.data.sortValue,
      sortValue = event.detail;
    if (oldSortValue === sortValue) {
      return false;
    }
    this.setData({
      sortValue: sortValue
    });
    this.datafilter();
  },

  onDropDownSortTypeValue(event) {
    let oldSortTypeValue = this.data.sortTypeValue,
      sortTypeValue = event.detail;
    if (oldSortTypeValue === sortTypeValue) {
      return false;
    }
    this.setData({
      sortTypeValue: sortTypeValue
    });
    this.datafilter();
  },

  onDropDownCaptain(event) {
    let oldCaptainName = this.data.captainNameValue,
      captainName = event.detail;
    if (oldCaptainName === captainName) {
      return false;
    }
    this.setData({
      captainNameValue: captainName
    });
    this.datafilter();
  },

  onDropDownChip(event) {
    let oldChipValue = this.data.chipValue,
      chipValue = event.detail;
    if (oldChipValue === chipValue) {
      return false;
    }
    this.setData({
      chipValue: chipValue
    });
    this.datafilter();
  },

  // 搜索
  onSearchClick() {
    this.setData({
      showModePicker: true,
    });
  },

  /**
   * 数据
   */

  initDataList() {
    // 拉取积分榜数据
    this.initEventChampionList();
    // 拉取tournament数据
    this.initTournamentResult();
  },

  initEventChampionList() {
    get('tournament/qryTournamentEventChampion', {
        tournamentId: this.data.tournamentId
      })
      .then(res => {
        if (res.data.id <= 0) {
          return false;
        }
        this.setData({
          championList: res.data.eventChampionResultList,
          runnerUpList: res.data.eventRunnerUpResultList,
          secondRunnerUpList: res.data.eventSecondRunnerUpResultList,
          championCountList: res.data.championCountList
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initTournamentResult() {
    get('tournament/qryTournamentEventResult', {
        event: this.data.gw,
        tournamentId: this.data.tournamentId
      })
      .then(res => {
        if (res.data.length === 0) {
          return false;
        }
        // 更新
        let list = [];
        res.data.forEach(element => {
          element.chip = getChipName(element.chip);
          list.push(element);
        });
        tournamentResultFullList = list;
        this.setData({
          totalNum: list.length
        });
        // 过滤数据
        this.datafilter();
        // 组装队长下拉菜单
        this.initCaptainDropDown();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initTournamentSearchResult() {
    get('tournament/qryTournamentEventSearchResult', {
        event: this.data.gw,
        tournamentId: this.data.tournamentId,
        element: this.data.searchElement
      })
      .then(res => {
        if (res.data.length === 0) {
          return false;
        }
        let list = [];
        res.data.eventResultList.forEach(element => {
          element.chip = getChipName(element.chip);
          list.push(element);
        });
        tournamentResultFullList = list;
        this.setData({
          searchWebName: this.data.searchWebName + " - " + res.data.selectByPercent + "(" + res.data.selectNum + "队)"
        });
        this.datafilter();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  refreshTournamentResult() {
    get('tournament/refreshTournamentEventResult', {
        event: this.data.gw,
        tournamentId: this.data.tournamentId,
      })
      .then(() => {
        // 下拉刷新
        if (this.data.pullDownRefresh) {
          wx.stopPullDownRefresh({
            success: () => {
              Toast({
                type: 'success',
                duration: 2500,
                message: "后台刷新中，请1分钟后再查询"
              });
              this.setData({
                pullDownRefresh: false
              });
            },
          });
        }
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  /**
   * 排序过滤
   */

  defaultDropDown() {
    this.setData({
      sortValue: 'points',
      sortTypeValue: 'desc',
      captainValue: '',
      chipValue: '全部',
      searchElement: 0,
      searchWebName: ''
    });
  },

  // 组装队长下拉选项
  initCaptainDropDown() {
    let captainList = [],
      nameList = [];
    // 全部
    captainList.push({
      text: '全部',
      value: '全部'
    });
    // 选择队长
    tournamentResultFullList.forEach(element => {
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

  datafilter() {
    let list = this.sortValue(tournamentResultFullList);
    list = this.captainFilter(list);
    list = this.chipFilter(list);
    list = this.rankList(list);
    tournamentResultList = list;
    this.setPageData();
  },

  // 字段排序
  sortValue(fullList) {
    let sortValue = this.data.sortValue,
      sortTypeValue = this.data.sortTypeValue,
      list = [];
    switch (sortValue) {
      case 'points': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.points - b.points);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.points - a.points);
        }
        break;
      }
      case 'netPoints': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.netPoints - b.netPoints);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.netPoints - a.netPoints);
        }
        break;
      }
      case 'overallPoints': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.overallPoints - b.overallPoints);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.overallPoints - a.overallPoints);
        }
        break;
      }
      case 'transferCost': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.transferCost - b.transferCost);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.transferCost - a.transferCost);
        }
        break;
      }
      case 'value': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.value - b.value);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.value - a.value);
        }
        break;
      }
      case 'bank': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.bank - b.bank);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.bank - a.bank);
        }
        break;
      }
    }
    return list;
  },

  // 队长过滤
  captainFilter(fullList) {
    let captainName = this.data.captainNameValue,
      list = [];
    if (captainName === '全部') {
      list = fullList;
    } else {
      fullList.forEach(element => {
        if (element.captainName === captainName) {
          list.push(element);
        }
      });
    }
    return list;
  },

  // 开卡过滤
  chipFilter(fullList) {
    let chip = this.data.chipValue,
      list = [];
    if (chip === '全部') {
      list = fullList;
    } else {
      fullList.forEach(element => {
        if (element.chip === chip) {
          list.push(element);
        }
      });
    }
    return list;
  },

  // 排序
  rankList(list) {
    let rankField = this.data.sortValue,
      rankValue = 0,
      rank = 0,
      repeat = 0;
    list.forEach((element) => {
      if (element[rankField] == rankValue) {
        repeat++;
        element.index = rank;
      } else {
        rank = rank + repeat + 1;
        repeat = 0;
        rankValue = element[rankField];
        element.index = rank;
      }
    });
    return list;
  },

  // 分页数据
  setPageData() {
    let currentPage = this.data.currentPage,
      list = [];
    for (let index = 1; index < tournamentResultList.length + 1; index++) {
      let start = 10 * (currentPage - 1) + 1,
        end = 10 * currentPage;
      if (index < start || index > end) {
        continue;
      }
      list.push(tournamentResultList[index - 1]);
    }
    let key = 'tournamentPageResultList[' + (currentPage - 1) + ']';
    this.setData({
      [key]: list
    });
  },

})