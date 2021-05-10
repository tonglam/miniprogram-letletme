const app = getApp();

import {
  get
} from '../../../utils/request';
import {
  getDifficultyColor
} from '../../../utils/utils';

const position = {
  'GKP': 1,
  'DEF': 2,
  'MID': 3,
  'FWD': 4
}

Page({

  data: {
    gw: app.globalData.gw,
    columns: [],
    loading: false,
    teamFixtureMap: {},
    teamGwFixtureMap: {},
    playerInfoMap: {},
    playerInfoData: {},
    playerDetailData: {},
    activeNames: ['fixture'],
  },

  onLoad: function (options) {
    this.getPlayerInfo(1);
  },

  // picker
  pickerOnChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    let playerInfo = this.data.playerInfoMap;
    if (index == 0) {
      picker.setColumnValues(1, playerInfo[Object.keys(playerInfo)[0]]);
      this.getPlayerInfo(position[value[0]]);
    } else if (index == 1) {
      this.setTeamFixture(value[1]);
      this.setPlayerInfoData(picker.getIndexes());
      picker.setColumnValues(2, playerInfo[value[1]].map(o => o.webName));
    } else if (index == 2) {
      this.setPlayerInfoData(picker.getIndexes());
    }
  },

  pickerOnConfirm(event) {
    console.log(this.data.playerInfoData);
  },

  // card
  cardOnOpen(event) {
    this.setPlayerDetail(event.detail);
  },

  cardOnChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  // team_fixture
  setTeamFixture(shortName) {
    get('player/qryTeamFixtureByShortName', {
        shortName: shortName
      })
      .then(res => {
        this.setData({
          teamFixtureMap: res.data,
        });
        this.setTeamGwFixtureMap();
      });
  },

  setTeamGwFixtureMap() {
    let gw = app.globalData.gw;
    for (let i = gw; i < i + 5; i++) {
      if (i >= 39) {
        break;
      }
      this.setFixtureMapByGw(i);
    }
  },

  setFixtureMapByGw(gw) {
    let map = this.data.teamGwFixtureMap;
    map[gw] = this.getGwFixtureList(gw);
    this.setData({
      teamGwFixtureMap: map
    });
  },

  getGwFixtureList(gw) {
    let list = [];
    let fixtureList = this.data.teamFixtureMap[gw];
    if (fixtureList === undefined) {
      let data = {
        event: gw,
        againstTeamName: 'BLANK',
        againstTeamShortName: 'BLANK',
        difficulty: -1,
        bgw: true,
        dgw: false
      };
      list.push(data);
    } else {
      for (const key in fixtureList) {
        if (Object.hasOwnProperty.call(fixtureList, key)) {
          const element = fixtureList[key];
          element.difficultyColor = getDifficultyColor(element.difficulty);
          list.push(element);
        }
      }
    }
    return list;
  },

  // player_detail
  getPlayerInfo(elementType) {
    this.setData({
      loading: true
    });
    get('player/qryPlayerInfoByElementType', {
        elementType: elementType
      })
      .then(res => {
        this.setData({
          playerInfoMap: res.data,
          loading: false,
          playerInfoData: res.data[Object.keys(res.data)[0]][0]
        });
        this.initColumns();
      });
  },

  setPlayerInfoData(indexes) {
    let teamIndex = indexes[1],
      elementIndex = indexes[2],
      playerInfo = this.data.playerInfoMap;;
    this.setData({
      activeNames: ['fixture'],
      playerInfoData: playerInfo[Object.keys(playerInfo)[teamIndex]][elementIndex]
    });
  },

  setPlayerDetail(element) {
    get('player/qryPlayerDetailData', {
        element: element
      })
      .then(res => {
        this.setData({
          playerDetailData: res.data
        });
      })
  },

  // others
  initColumns() {
    let playerInfo = this.data.playerInfoMap;
    this.setData({
      columns: [
        {
          values: Object.keys(position),
          className: 'position',
        },
        {
          values: Object.keys(playerInfo),
          className: 'team',
        },
        {
          values: playerInfo[Object.keys(playerInfo)[0]].map(o => o.webName),
          className: 'player',
        }
      ],
    });
    this.setTeamFixture(Object.keys(playerInfo)[0]);
  },


})