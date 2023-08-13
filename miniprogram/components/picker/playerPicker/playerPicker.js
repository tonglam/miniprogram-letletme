import {
  get
} from '../../../utils/request';
import {
  getDifficultyColor
} from '../../../utils/utils';

const app = getApp();

Component({

  properties: {
    type: Number,
    show: Boolean,
    detailShow: Boolean,
  },

  data: {
    event: 'pickResult',
    elementType: 1,
    gw: 0,
    position: {},
    columns: [],
    loading: false,
    teamFixtureMap: {},
    teamGwFixtureMap: {},
    playerInfoMap: {},
    playerInfoData: {},
    playerDetailData: {},
    activeNames: ['fixture'],
    triggered: false,
  },

  lifetimes: {
    attached: function () {
      this.data.elementType = this.properties.type;
      this.setData({
        gw: app.globalData.gw,
      });
      // 初始化选项
      this.initPosition();
      this.initPlayerInfo();
    },
  },

  methods: {

    // picker
    pickerOnChange(event) {
      const {
        picker,
        value,
        index
      } = event.detail;
      let playerInfo = this.data.playerInfoMap;
      if (index == 0) {
        this.setData({
          elementType: this.data.position[value[0]]
        });
        this.getPlayerInfo(picker.getIndexes());
        this.setPlayerInfoData(picker.getIndexes());
      } else if (index == 1) {
        this.setTeamFixture(value[1]);
        let initIndex = [picker.getIndexes()[0], picker.getIndexes()[1], 0];
        this.setPlayerInfoData(initIndex);
        picker.setColumnValues(2, playerInfo[value[1]].map(o => o.webName));
      } else if (index == 2) {
        this.setPlayerInfoData(picker.getIndexes());
      }
    },

    pickerOnConfirm() {
      this.triggerEvent(this.data.event, this.data.playerInfoData);
    },

    pickerOnCancel() {
      this.triggerEvent(this.data.event, '');
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
        }, false)
        .then(res => {
          this.setData({
            teamFixtureMap: res.data,
          });
          this.setTeamGwFixtureMap();
        });
    },

    setTeamGwFixtureMap() {
      let nextGw = app.globalData.nextGw;
      for (let i = nextGw; i < i + 5; i++) {
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
    initPlayerInfo() {
      this.setData({
        loading: true
      });
      // 设置element_type
      let type = this.properties.type;
      if (type !== 1 && type !== 2 && type !== 3 && type !== 4) {
        this.data.elementType = 1;
      } else {
        this.data.elementType = type;
      }
      let indexes = [0, 0, 0];
      this.getPlayerInfo(indexes);
    },

    getPlayerInfo(indexes) {
      let teamIndex = indexes[1],
        elementIndex = indexes[2];
      get('player/qryPlayerInfoByElementType', {
          elementType: this.data.elementType
        }, false)
        .then(res => {
          this.setData({
            playerInfoMap: res.data,
            loading: false,
            playerInfoData: res.data[Object.keys(res.data)[teamIndex]][elementIndex]
          });
          this.initColumns(teamIndex);
        })
        .catch(res => {
          console.log('fail:', res);
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
      get('player/qryPlayerDetailByElement', {
          element: element
        }, false)
        .then(res => {
          this.setData({
            playerDetailData: res.data
          });
        })
        .catch(res => {
          console.log('fail:', res);
        });
    },

    // others
    initPosition() {
      let position = {};
      switch (this.data.elementType) {
        case 1:
          position["GKP"] = 1;
          break;
        case 2:
          position["DEF"] = 2;
          break;
        case 3:
          position["MID"] = 3;
          break;
        case 4:
          position["FWD"] = 4;
          break;
        default:
          position["GKP"] = 1;
          position["DEF"] = 2;
          position["MID"] = 3;
          position["FWD"] = 4;
      }
      this.setData({
        position: position
      });
    },

    initColumns(teamIndex) {
      let playerInfo = this.data.playerInfoMap;
      this.setData({
        columns: [{
            values: Object.keys(this.data.position),
            className: 'position',
          },
          {
            values: Object.keys(playerInfo),
            className: 'team',
          },
          {
            values: playerInfo[Object.keys(playerInfo)[teamIndex]].map(o => o.webName),
            className: 'player',
          }
        ],
      });
      this.setTeamFixture(Object.keys(playerInfo)[0]);
    },
  }

})