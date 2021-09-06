import {
  get
} from '../../../utils/request';
import {
  showOverallRank
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();
let playerFullList = [],
  playerList = [];

Page({

  data: {
    // 数据
    gw: 0,
    season: '',
    teamList: [],
    playerTableList: [],
    // piker
    seasonPickerShow: false,
    // dropdown
    positonOptions: [],
    positionValue: '',
    teamOptions: [],
    teamValue: '',
    priceOptions: [],
    priceValue: '',
    sortOptions: [],
    sortValue: '',
    sortTypeOptions: [],
    sortTypeValue: '',
    // search
    searchWebName: '',
    // switch
    switchTeam: true,
    switchPosition: true,
    switchPrice: true,
    switchSelected: true,
    switchPoints: false,
    switchMinutes: false,
    switchGoalsScored: false,
    switchAssists: false,
    switchCleanSheets: false,
    switchBonus: false,
    switchBps: false,
    switchTransfersInEvent: false,
    switchTransfersOutEvent: false,
    switchTransfersIn: false,
    switchTransfersOut: false,
    // table
    header: [],
     // refresh
     pullDownRefresh: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    if (this.data.playerTableList.length > 0) {
      return false;
    }
    this.setData({
      gw: app.globalData.gw
    });
    let season = wx.getStorageSync('stat-filter-season');
    if (season === '') {
      season = app.globalData.season;
    }
    this.setData({
      season: season,
    });
    // 默认下拉菜单
    this.defaultDropDown();
    // 表头
    this.defaultHeader();
    // 拉取球员列表
    this.initFilterPlayers();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 刷新身价
    this.refreshPlayerStat();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  onDropDownSeason(event) {
    let oldValue = this.data.positionValue,
      newValue = event.detail;
    if (oldValue === newValue) {
      return false;
    }
    this.setData({
      season: newValue
    });
    // team 
    this.iniTeamList();
    // 拉取球员列表 
    this.initFilterPlayers();
  },

  onDropDownPosition(event) {
    let oldValue = this.data.positionValue,
      newValue = event.detail;
    if (oldValue === newValue) {
      return false;
    }
    this.setData({
      positionValue: newValue
    });
    this.defaultPriceDropDown();
    this.datafilter();
  },

  onDropDownTeam(event) {
    let oldValue = this.data.teamValue,
      newValue = event.detail;
    if (oldValue === newValue) {
      return false;
    }
    this.setData({
      teamValue: newValue
    });
    this.datafilter();
  },

  onDropDownPrice(event) {
    let oldValue = this.data.priceValue,
      newValue = event.detail;
    if (oldValue === newValue) {
      return false;
    }
    this.setData({
      priceValue: newValue
    });
    this.datafilter();
  },

  onDropDownSortValue(event) {
    let oldValue = this.data.sortValue,
      newValue = event.detail;
    if (oldValue === newValue) {
      return false;
    }
    this.setData({
      sortValue: newValue
    });
    this.datafilter();
  },

  onDropDownSortTypeValue(event) {
    let oldValue = this.data.sortTypeValue,
      newValue = event.detail;
    if (oldValue === newValue) {
      return false;
    }
    this.setData({
      sortTypeValue: newValue,
      playerList: [],
    });
    this.datafilter();
  },

  // search
  onSearchChange(event) {
    this.setData({
      searchWebName: event.detail,
      playerTableList: [],
    });
    this.setTableData();
  },

  onResetClick() {
    this.setData({
      playerTableList: [],
    });
    // 默认下拉菜单
    this.defaultDropDown();
    // 表头
    this.defaultHeader();
    // 拉取球员列表
    this.initFilterPlayers();
  },

  // 数据项开关
  onSwitchTeamChange({
    detail
  }) {
    this.setData({
      switchTeam: detail
    });
    this.setHeader();
  },

  onSwitchPositionChange({
    detail
  }) {
    this.setData({
      switchPosition: detail
    });
    this.setHeader();
  },

  onSwitchPriceChange({
    detail
  }) {
    this.setData({
      switchPrice: detail
    });
    this.setHeader();
  },

  onSwitchSelectedChange({
    detail
  }) {
    this.setData({
      switchSelected: detail
    });
    this.setHeader();
  },

  onSwitchPointsChange({
    detail
  }) {
    this.setData({
      switchPoints: detail
    });
    this.setHeader();
  },

  onSwitchMinitesChange({
    detail
  }) {
    this.setData({
      switchMinutes: detail
    });
    this.setHeader();
  },

  onSwitchGoalsScoredChange({
    detail
  }) {
    this.setData({
      switchGoalsScored: detail
    });
    this.setHeader();
  },

  onSwitchAssistsChange({
    detail
  }) {
    this.setData({
      switchAssists: detail
    });
    this.setHeader();
  },

  onSwitchCleanSheetsChange({
    detail
  }) {
    this.setData({
      switchCleanSheets: detail
    });
    this.setHeader();
  },

  onSwitchBonusChange({
    detail
  }) {
    this.setData({
      switchBonus: detail
    });
    this.setHeader();
  },

  onSwitchBpsChange({
    detail
  }) {
    this.setData({
      switchBps: detail
    });
    this.setHeader();
  },

  onSwitchTransfersInEventChange({
    detail
  }) {
    this.setData({
      switchTransfersInEvent: detail
    });
    this.setHeader();
  },

  onSwitchTransfersOutEventChange({
    detail
  }) {
    this.setData({
      switchTransfersOutEvent: detail
    });
    this.setHeader();
  },

  onSwitchTransfersInChange({
    detail
  }) {
    this.setData({
      switchTransfersIn: detail
    });
    this.setHeader();
  },

  onSwitchTransfersOutChange({
    detail
  }) {
    this.setData({
      switchTransfersOut: detail
    });
    this.setHeader();
  },

  // 行点击
  onRowClick(event) {
    let code = event.detail.target.dataset.it.code,
      season = this.data.season,
      url = '/pages/stat/player/player?code=' + code + '&season=' + season;
    wx.navigateTo({
      url: url,
    });
  },

  /**
   * 默认筛选项
   */

  defaultDropDown() {
    // season 
    this.defaultSeasonDropDown();
    // position
    this.defaultPositionDropDown();
    // team
    this.iniTeamList();
    // price
    this.defaultPriceDropDown();
    // sort
    this.defaultSortDropDown();
    // sortType
    this.defaultSortTypeDropDown();
  },

  defaultSeasonDropDown() {
    let seasonOptions = [{
        text: '2122赛季',
        value: '2122'
      },
      {
        text: '2021赛季',
        value: '2021'
      },
      {
        text: '1920赛季',
        value: '1920'
      },
      {
        text: '1819赛季',
        value: '1819'
      },
      {
        text: '1718赛季',
        value: '1718'
      },
      {
        text: '1617赛季',
        value: '1617'
      }
    ];
    this.setData({
      seasonOptions: seasonOptions,
      season: this.data.season
    });
  },

  defaultPositionDropDown() {
    let positonOptions = [{
          text: '所有位置',
          value: '全部'
        },
        {
          text: 'GKP',
          value: 'GKP'
        },
        {
          text: 'DEF',
          value: 'DEF'
        },
        {
          text: 'MID',
          value: 'MID'
        },
        {
          text: 'FWD',
          value: 'FWD'
        }
      ],
      positionValue = '全部';
    this.setData({
      positonOptions: positonOptions,
      positionValue: positionValue
    });
  },

  defaultTeamDropDown() {
    let teamValue = this.data.teamValue,
      teamList = this.data.teamList,
      list = [],
      initData = {};
    initData["text"] = '所有球队';
    initData["value"] = '全部';
    list.push(initData);
    teamList.forEach(element => {
      let data = {};
      data["text"] = element;
      data["value"] = element;
      list.push(data);
    });
    let nameList = list.map(o => o.value);
    if (teamValue === '' || teamValue === '全部' || !nameList.includes(teamValue)) {
      teamValue = '全部'
    }
    this.setData({
      teamOptions: list,
      teamValue: teamValue
    });
  },

  defaultPriceDropDown() {
    let priceOptions = [],
      baseOptions = [{
        text: '不限价',
        value: 'umlimited'
      }],
      lowestOptions = [{
        text: '4.0m',
        value: '4.0'
      }],
      lowOptions = [{
          text: '4.5m',
          value: '4.5'
        },
        {
          text: '5.0m',
          value: '5.0'
        },
        {
          text: '5.5m',
          value: '5.5'
        },
        {
          text: '6.0m',
          value: '6.0'
        }
      ],
      midOptions = [{
          text: '6.5m',
          value: '6.5'
        },
        {
          text: '7.0m',
          value: '7.0'
        },
        {
          text: '7.5m',
          value: '7.5'
        }
      ],
      highOptions = [{
          text: '8.0m',
          value: '8.0'
        },
        {
          text: '8.5m',
          value: '8.5'
        },
        {
          text: '9.0m',
          value: '9.0'
        },
        {
          text: '9.5m',
          value: '9.5'
        },
        {
          text: '10.0m',
          value: '10.0'
        },
        {
          text: '10.5m',
          value: '10.5'
        },
        {
          text: '11.0m',
          value: '11.0'
        },
        {
          text: '11.5m',
          value: '11.5'
        },
        {
          text: '12.0m',
          value: '12.0'
        },
        {
          text: '12.5m',
          value: '12.5'
        }
      ],
      priceValue = 'umlimited',
      position = this.data.positionValue;
    switch (position) {
      case 'GKP': {
        priceOptions = baseOptions.concat(lowestOptions, lowOptions);
        break;
      }
      case 'DEF': {
        priceOptions = baseOptions.concat(lowestOptions, lowOptions, midOptions);
        break;
      }
      case 'MID': {
        priceOptions = baseOptions.concat(lowOptions, midOptions, highOptions);
        break;
      }
      case 'FWD': {
        priceOptions = baseOptions.concat(lowOptions, midOptions, highOptions);
        break;
      }
      default: {
        priceOptions = baseOptions.concat(lowestOptions, lowOptions, midOptions, highOptions);
      }
    }
    this.setData({
      priceOptions: priceOptions,
      priceValue: priceValue
    });
  },

  defaultSortDropDown() {
    let sortOptions = [{
          text: '总分',
          value: 'points'
        }, {
          text: '身价',
          value: 'price'
        }, {
          text: '持有率',
          value: 'selectedByPercent'
        }, {
          text: '进球',
          value: 'goalsScored'
        },
        {
          text: '助攻',
          value: 'assists'
        }, {
          text: '零封',
          value: 'cleanSheets'
        }, {
          text: 'BONUS',
          value: 'bonus'
        }, {
          text: 'BPS',
          value: 'bps'
        }, {
          text: '周转入',
          value: 'transfersInEvent'
        }, {
          text: '周转出',
          value: 'transfersOutEvent'
        }
      ],
      sortValue = 'points';
    this.setData({
      sortOptions: sortOptions,
      sortValue: sortValue
    });
  },

  defaultSortTypeDropDown() {
    let sortTypeOptions = [{
        text: '降序',
        value: 'desc'
      }, {
        text: '升序',
        value: 'asc'
      }],
      sortTypeValue = 'desc';
    this.setData({
      sortTypeOptions: sortTypeOptions,
      sortTypeValue: sortTypeValue
    });
  },

  defaultHeader() {
    let header = [{
        prop: 'webName',
        width: 200,
        label: '球员'
      }, {
        prop: 'teamShortName',
        width: 120,
        label: '球队'
      },
      {
        prop: 'elementTypeName',
        width: 120,
        label: '位置'
      },
      {
        prop: 'price',
        width: 150,
        label: '身价(m)'
      },
      {
        prop: 'selectedByPercent',
        width: 150,
        label: '持有(%)'
      }
    ];
    this.setData({
      header: header
    });
  },

  setHeader() {
    let header = [{
      prop: 'webName',
      width: 300,
      label: '球员'
    }];
    if (this.data.switchTeam) {
      header.push({
        prop: 'teamShortName',
        width: 120,
        label: '球队'
      });
    }
    if (this.data.switchPosition) {
      header.push({
        prop: 'elementTypeName',
        width: 120,
        label: '位置'
      });
    }
    if (this.data.switchPrice) {
      header.push({
        prop: 'price',
        width: 150,
        label: '身价(m)'
      });
    }
    if (this.data.switchSelected) {
      header.push({
        prop: 'selectedByPercent',
        width: 150,
        label: '持有(%)'
      });
    }
    if (this.data.switchPoints) {
      header.push({
        prop: 'points',
        width: 120,
        label: '总分'
      });
    }
    if (this.data.switchMinutes) {
      header.push({
        prop: 'minutes',
        width: 120,
        label: '时间'
      });
    }
    if (this.data.switchGoalsScored) {
      header.push({
        prop: 'goalsScored',
        width: 120,
        label: '进球'
      });
    }
    if (this.data.switchAssists) {
      header.push({
        prop: 'assists',
        width: 120,
        label: '助攻'
      });
    }
    if (this.data.switchCleanSheets) {
      header.push({
        prop: 'cleanSheets',
        width: 120,
        label: '零封'
      });
    }
    if (this.data.switchBonus) {
      header.push({
        prop: 'bonus',
        width: 120,
        label: 'BOUNS'
      });
    }
    if (this.data.switchBps) {
      header.push({
        prop: 'bps',
        width: 120,
        label: 'BPS'
      });
    }
    if (this.data.switchTransfersInEvent) {
      header.push({
        prop: 'transfersInEvent',
        width: 120,
        label: '周转入'
      });
    }
    if (this.data.switchTransfersOutEvent) {
      header.push({
        prop: 'transfersOutEvent',
        width: 120,
        label: '周转出'
      });
    }
    if (this.data.switchTransfersIn) {
      header.push({
        prop: 'transfersIn',
        width: 120,
        label: '总转入'
      });
    }
    if (this.data.switchTransfersOut) {
      header.push({
        prop: 'transfersOut',
        width: 120,
        label: '总转出'
      });
    }
    this.setData({
      header: header
    });
  },

  /**
   * 排序和过滤
   */

  datafilter() {
    this.setData({
      playerTableList: []
    });
    let list = [];
    // 筛选
    list = this.positionFilter(playerFullList);
    list = this.teamFilter(list);
    list = this.priceFilter(list);
    // 过滤
    list = this.sortValue(list);
    playerList = list;
    // 表格
    this.setTableData();
  },

  // 位置过滤
  positionFilter(fullList) {
    let position = this.data.positionValue;
    if (position === '全部') {
      return fullList;
    }
    let list = [];
    fullList.forEach(element => {
      if (element.elementTypeName === position) {
        list.push(element);
      }
    });
    return list;
  },

  // 球队过滤
  teamFilter(fullList) {
    let team = this.data.teamValue;
    if (team === '全部') {
      return fullList;
    }
    let list = []
    fullList.forEach(element => {
      if (element.teamShortName === team) {
        list.push(element);
      }
    });
    return list;
  },

  // 身价过滤
  priceFilter(fullList) {
    let price = this.data.priceValue;
    if (price === 'umlimited') {
      return fullList;
    }
    let list = []
    fullList.forEach(element => {
      price = parseFloat(price);
      let elementPrice = parseFloat(element.price);
      if (elementPrice >= price) {
        list.push(element);
      }
    });
    return list;
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
      case 'price': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.price - b.price);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.price - a.price);
        }
        break;
      }
      case 'selectedByPercent': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.selectedByPercent - b.selectedByPercent);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.selectedByPercent - a.selectedByPercent);
        }
        break;
      }
      case 'goalsScored': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.goalsScored - b.goalsScored);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.goalsScored - a.goalsScored);
        }
        break;
      }
      case 'assists': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.assists - b.assists);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.assists - a.assists);
        }
        break;
      }
      case 'cleanSheets': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.cleanSheets - b.cleanSheets);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.cleanSheets - a.cleanSheets);
        }
        break;
      }
      case 'bonus': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.bonus - b.bonus);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.bonus - a.bonus);
        }
        break;
      }
      case 'bps': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.bps - b.bps);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.bps - a.bps);
        }
        break;
      }
      case 'transfersInEvent': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.transfersInEvent - b.transfersInEvent);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.transfersInEvent - a.transfersInEvent);
        }
        break;
      }
      case 'transfersOutEvent': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.transfersOutEvent - b.transfersOutEvent);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.transfersOutEvent - a.transfersOutEvent);
        }
        break;
      }
      case 'transfersIn': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.transfersIn - b.transfersIn);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.transfersIn - a.transfersIn);
        }
        break;
      }
      case 'transfersOut': {
        if (sortTypeValue === 'asc') {
          list = fullList.sort((a, b) => a.transfersOut - b.transfersOut);
        } else if (sortTypeValue === 'desc') {
          list = fullList.sort((a, b) => b.transfersOut - a.transfersOut);
        }
        break;
      }
    }
    return list;
  },

  // 表格数据
  setTableData() {
    // 搜索
    let searchWebName = this.data.searchWebName.toLowerCase(),
      list = [];
    if (searchWebName === '') {
      list = playerList;
    } else {
      playerList.forEach(element => {
        let webName = (element.webName + '').toLowerCase();
        if (webName.includes(searchWebName) > 0) {
          list.push(element);
        }
      });
    }
    this.setData({
      playerTableList: list
    });
  },

  /**
   * 数据
   */

  initFilterPlayers() {
    get('player/qryFilterPlayers', {
        season: this.data.season
      })
      .then(res => {
        let list = res.data;
        list.forEach(element => {
          element.transfersInEvent = showOverallRank(element.transfersInEvent);
          element.transfersOutEvent = showOverallRank(element.transfersOutEvent);
          element.transfersIn = showOverallRank(element.transfersIn);
          element.transfersOut = showOverallRank(element.transfersOut);
        });
        playerFullList = list;
        // 过滤数据
        this.datafilter();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  iniTeamList() {
    get('common/qryTeamList', {
        season: this.data.season
      })
      .then(res => {
        let list = res.data;
        this.setData({
          teamList: list.map(o => o.shortName)
        });
        this.defaultTeamDropDown();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  refreshPlayerStat(){
    get('player/refreshPlayerStat')
    .then(() => {
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
      // 更新
      this.initFilterPlayers();
    })
  }

})