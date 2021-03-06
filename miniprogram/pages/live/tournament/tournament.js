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
    tournamentId: 0,
    tournamentName: "",
    tournamentInfoData: {},
    currentPage: 1,
    totalNum: 0,
    livePageDataList: [],
    // picker
    showTournamentPicker: false,
    showModePicker: false,
    showPlayerPicker: false,
    modes: ['选择fpl球队', '选择球员'],
    // refrsh
    pullDownRefresh: false,
    // dropdown
    sortOptions: [{
        text: '实时得分',
        value: 'livePoints'
      },
      {
        text: '实时净得分',
        value: 'liveNetPoints'
      },
      {
        text: '实时总分',
        value: 'liveTotalPoints'
      },
      {
        text: '剁手',
        value: 'transferCost'
      },
      {
        text: '已出场',
        value: 'played'
      },
      {
        text: '待出场',
        value: 'toPlay'
      }
    ],
    sortValue: 'livePoints',
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
    searchMode: 'entry',
    searchEntry: '',
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
    let tournamentId = wx.getStorageSync('live-tournamentId');
    if (tournamentId > 0) {
      let tournamentName = wx.getStorageSync('live-tournamentName');
      this.setData({
        tournamentId: tournamentId,
        tournamentName: tournamentName
      });
      // 刷新live
      if (this.data.livePageDataList.length === 0) {
        this.initLiveTournament();
      }
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

  // 重置
  onClickReset() {
    // 默认下拉菜单
    this.defaultDropDown();
    // 默认设置
    this.setData({
      searchMode: 'entry',
      showModePicker: false,
      searchEntry: '',
      searchElement: 0,
      searchWebName: ''
    });
    // 刷新live
    this.initLiveTournament();
  },

  // 更换联赛
  onClickChange() {
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
    wx.setStorageSync('live-tournamentId', tournamentId);
    wx.setStorageSync('live-tournamentName', tournamentName);
    // 设置
    this.setData({
      tournamentId: tournamentId,
      tournamentName: tournamentName,
      livePageDataList: [],
    });
    // 刷新live
    this.initLiveTournament();
  },

  // 搜索模式picker确认
  onModePickerConfirm(event) {
    let mode = event.detail.value;
    if (mode === '选择fpl球队') {
      this.setData({
        searchMode: 'entry',
        searchElement: 0,
        searchWebName: '',
        showModePicker: false,
        showPlayerPicker: false
      });
      // 刷新live
      this.initLiveTournament();
    } else if (mode === '选择球员') {
      this.setData({
        searchMode: 'element',
        searchEntry: '',
        showModePicker: false,
        showPlayerPicker: true
      });
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
    this.initLiveSearchDataList();
    this.datafilter();
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
  onSearchChange(event) {
    this.setData({
      searchEntry: event.detail,
    });
    this.datafilter();
  },

  onSearchClick() {
    this.setData({
      showModePicker: true,
    });
  },

  /**
   * 排序过滤
   */

  defaultDropDown() {
    this.setData({
      sortValue: 'livePoints',
      sortTypeValue: 'desc',
      captainValue: '',
      captainNameValue: '全部',
      chipValue: '全部',
      searchMode: 'entry',
      searchEntry: '',
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
    liveDataFullList.forEach(element => {
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
    this.setData({
      currentPage: 1,
      livePageDataList: []
    });
    let list = [];
    list = this.sortValue(liveDataFullList);
    list = this.captainFilter(list);
    list = this.chipFilter(list);
    list = this.searchList(list);
    list = this.rankList(list);
    liveDataList = list;
    this.setPageData();
  },

  // 字段排序
  sortValue(fullList) {
    let sortValue = this.data.sortValue,
      sortTypeValue = this.data.sortTypeValue,
      list = [];
    switch (sortValue) {
      case 'livePoints': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.livePoints - b.livePoints);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.livePoints - a.livePoints);
        }
        break;
      }
      case 'liveNetPoints': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.liveNetPoints - b.liveNetPoints);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.liveNetPoints - a.liveNetPoints);
        }
        break;
      }
      case 'liveTotalPoints': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.liveTotalPoints - b.liveTotalPoints);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.liveTotalPoints - a.liveTotalPoints);
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
      case 'played': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.played - b.played);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.played - a.played);
        }
        break;
      }
      case 'toPlay': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.toPlay - b.toPlay);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.toPlay - a.toPlay);
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

  // 排序
  rankList(list) {
    let rankField = this.data.sortValue,
      rankValue = 0,
      rank = 0,
      repeat = 0;
    list.forEach((element) => {
      if (element[rankField] == rankValue) {
        repeat++;
        element.rank = rank;
      } else {
        rank = rank + repeat + 1;
        repeat = 0;
        rankValue = element[rankField];
        element.rank = rank;
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
        // 组装队长下拉菜单
        this.initCaptainDropDown();
      })
      .catch(res => {
        console.log('fail:', res);
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

  // 球员搜索
  initLiveSearchDataList() {
    get('live/calcSearchLivePointsByTournament', {
        event: this.data.gw,
        tournamentId: this.data.tournamentId,
        element: this.data.searchElement
      })
      .then(res => {
        if (res.data.length === 0) {
          return false;
        }
        let list = [];
        res.data.liveCalcDataList.forEach(element => {
          element.chip = getChipName(element.chip);
          list.push(element);
        });
        liveDataFullList = list;
        this.setData({
          searchWebName: this.data.searchWebName + " - " + res.data.selectByPercent + "(" + res.data.selectNum + "队)"
        });
        this.datafilter();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})