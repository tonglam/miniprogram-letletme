import {
  get
} from "../../../utils/request";
import {
  getChipName
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    tournamentId: 0,
    tournamentName: "",
    tournamentInfoData: {},
    liveDataFullList: [],
    liveDataList: [],
    // picker
    showTournamentPicker: false,
    showModePicker: false,
    showPlayerPicker: false,
    modes: ['选择球员', '清空选择'],
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
      this.initLiveTournament();
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

  // 重置
  onClickReset() {
    // 默认下拉菜单
    this.defaultDropDown();
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
      tournamentName: tournamentName
    });
    // 刷新live
    this.initLiveTournament();
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
      // 刷新live
      this.initLiveTournament();
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
          liveDataFullList: list,
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

  initLiveSearchDataList() {
    get('live/calcSearchLivePointsByTournament', {
        event: this.data.gw,
        tournamentId: this.data.tournamentId,
        element: this.data.searchElement
      })
      .then(res => {
        let list = [];
        res.data.forEach(element => {
          element.chip = getChipName(element.chip);
          list.push(element);
        });
        this.setData({
          liveDataFullList: list
        });
        this.datafilter();
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
      sortValue: 'livePoints',
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
    this.data.liveDataFullList.forEach(element => {
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
    let list = this.sortValue(this.data.liveDataFullList);
    list = this.captainFilter(list);
    list = this.chipFilter(list);
    list = this.rankList(list);
    this.setData({
      liveDataList: list
    });
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
          list = fullList.sort((a, b) => b.liveNetPoints - a.liveNetPoints);
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

})