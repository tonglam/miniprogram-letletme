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
    playerPageList: [],
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
    // 拉取球员列表
    this.initAllPlayers();
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // dropDown选择
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
    // this.datafilter();
  },

  onDropDownTeam(event) {},

  onDropDownPrice(event) {},

  onDropDownSortValue(event) {},

  onDropDownSortTypeValue(event) {},

  /**
   * 默认筛选项
   */

  defaultDropDown() {
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

  defaultPositionDropDown() {
    let positonOptions = [{
          text: '全部',
          value: 'all'
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
      positionValue = 'all';
    this.setData({
      positonOptions: positonOptions,
      positionValue: positionValue
    });
  },

  defaultTeamDropDown() {
    let teamList = this.data.teamList,
      list = [];
    let data = {};
    data["text"] = '全部';
    data["value"] = '全部';
    list.push(data);
    teamList.forEach(element => {
      let data = {};
      data["text"] = element;
      data["value"] = element;
      list.push(data);
    });
    this.setData({
      teamOptions: list,
      teamValue: '全部'
    });
  },

  defaultPriceDropDown() {
    let priceOptions = [],
      baseOptions = [{
          text: '无限',
          value: 'umlimited'
        },
        {
          text: '预算内',
          value: 'affordable'
        }
      ],
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
      priceValue = 'affordable',
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
          text: '身价',
          value: 'price'
        }, {
          text: '总分',
          value: 'points'
        }, {
          text: '持有率',
          value: 'selectedByPercent'
        }, {
          text: '进球',
          value: 'goals'
        },
        {
          text: '助攻',
          value: 'points'
        }, {
          text: '零封',
          value: 'points'
        }, {
          text: 'BONUS',
          value: 'points'
        }, {
          text: 'BPS',
          value: 'points'
        }, {
          text: '转入',
          value: 'transfersIn'
        }, {
          text: '转出',
          value: 'transfersOut'
        }
      ],
      sortValue = 'price';
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

  /**
   * 排序和过滤
   */

  /**
   * 数据
   */

  initAllPlayers() {
    get('player/qryAllPlayers', {
        season: this.data.season
      })
      .then(res => {
        playerFullList = res.data;
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