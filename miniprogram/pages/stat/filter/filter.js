import {
  get
} from '../../../utils/request';

const app = getApp();
let playerFullList = [],
  playerList = [];

Page({

  data: {
    // 数据
    gw: 0,
    season: '',
    teamList: [],
    currentPage: 1,
    totalNum: 0,
    playerPageList: [],
    // dropdown
    seasonOptions: [],
    seasonValue: '',
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
    // table
    header: [],
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      gw: app.globalData.gw,
      season: app.globalData.season
    });
    // 默认下拉菜单
    this.defaultDropDown();
    // 表头
    this.defaultHeader();
    // 拉取球员列表
    this.initFilterPlayers();
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

  // dropDown选择
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
      sortTypeValue: newValue
    });
    this.datafilter();
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
      }
    ];
    this.setData({
      seasonOptions: seasonOptions,
      season: app.globalData.season
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
        text: '不限价格',
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
        width: 300,
        label: '球员'
      }, {
        prop: 'teamShortName',
        width: 150,
        label: '球队'
      },
      {
        prop: 'elementTypeName',
        width: 150,
        label: '位置'
      },
      {
        prop: 'price',
        width: 150,
        label: '身价'
      },
      {
        prop: 'points',
        width: 150,
        label: '总分'
      },
      {
        prop: 'selectedByPercent',
        width: 150,
        label: '持有率'
      },
      {
        prop: 'minutes',
        width: 150,
        label: '上场时间'
      },
      {
        prop: 'goalsScored',
        width: 150,
        label: '进球'
      },
      {
        prop: 'assists',
        width: 150,
        label: '助攻'
      },
      {
        prop: 'cleanSheets',
        width: 150,
        label: '零封'
      },
      {
        prop: 'bonus',
        width: 150,
        label: 'BOUNS'
      },
      {
        prop: 'bps',
        width: 150,
        label: 'BPS'
      },
      {
        prop: 'transfersInEvent',
        width: 150,
        label: '周转入'
      },
      {
        prop: 'transfersOutEvent',
        width: 150,
        label: '周转出'
      }
    ];
    this.setData({
      header: header
    });
  },

  /**
   * 排序和过滤
   */

  datafilter() {
    this.setData({
      currentPage: 1,
      playerPageList: []
    });
    let list = [];
    list = this.positionFilter(playerFullList);
    list = this.teamFilter(list);
    list = this.priceFilter(list);
    list = this.sortValue(list);
    list = this.rankList(list);
    playerList = list;
    this.setPageData();
  },

  // 位置过滤
  positionFilter(fullList) {
    let position = this.data.positionValue,
      list = [];
    if (position === '全部') {
      list = fullList;
    } else {
      fullList.forEach(element => {
        if (element.elementTypeName === position) {
          list.push(element);
        }
      });
    }
    return list;
  },

  // 球队过滤
  teamFilter(fullList) {
    let team = this.data.teamValue,
      list = [];
    if (team === '全部') {
      list = fullList;
    } else {
      fullList.forEach(element => {
        if (element.teamShortName === team) {
          list.push(element);
        }
      });
    }
    return list;
  },

  // 身价过滤
  priceFilter(fullList) {
    let price = this.data.priceValue,
      list = [];
    if (price === 'umlimited') {
      list = fullList;
    } else {
      fullList.forEach(element => {
        price = parseFloat(price);
        let elementPrice = parseFloat(element.price);
        if (elementPrice >= price) {
          list.push(element);
        }
      });
    }
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
        element.id = rank;
      } else {
        rank = rank + repeat + 1;
        repeat = 0;
        rankValue = element[rankField];
        element.id = rank;
      }
    });
    return list;
  },

  // 分页数据
  setPageData() {
    let currentPage = this.data.currentPage,
      list = [];
    for (let index = 1; index < playerList.length + 1; index++) {
      let start = 15 * (currentPage - 1) + 1,
        end = 15 * currentPage;
      if (index < start || index > end) {
        continue;
      }
      let element = playerList[index - 1],
        price = element.price + '',
        selectedByPercent = element.selectedByPercent + '';
      if (price.indexOf('m') === -1) {
        element.price = price + 'm';
      }
      if (selectedByPercent.indexOf('%') === -1) {
        element.selectedByPercent = selectedByPercent + '%';
      }
      list.push(element);
    }
    this.setData({
      playerPageList: this.data.playerPageList.concat(list)
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
        playerFullList = list;
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
  }

})