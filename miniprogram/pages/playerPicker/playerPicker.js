import {
  get
} from '../../utils/request';

const position = {
  'GKP': 1,
  'DEF': 2,
  'MID': 3,
  'FWD': 4
}

Page({

  data: {
    event: 0,
    playerInfoMap: {},
    columns: [],
    loading: false,
    teamFixtureList: {},
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
      this.setPlayerInfoData(picker.getIndexes());
      picker.setColumnValues(2, playerInfo[value[1]].map(o => o.webName));
    } else if (index == 2) {
      this.setPlayerInfoData(picker.getIndexes());
    }
  },

  pickerOnConfirm(event) {},

  pickerOnCancel() {},

  // card
  cardOnOpen(event) {
    this.getPlayerDetail(event.detail);
  },

  cardOnChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  // other
  getPlayerInfo(elementType) {
    this.setData({
      loading: true
    });
    get('common/qryPlayerInfoByElementType', {
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

  initColumns() {
    let playerInfo = this.data.playerInfoMap;
    this.setData({
      columns: [{
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
    })
  },

  setPlayerInfoData(indexes) {
    let teamIndex = indexes[1],
      elementIndex = indexes[2],
      playerInfo = this.data.playerInfoMap;;
    this.setData({
      activeNames: [],
      playerInfoData: playerInfo[Object.keys(playerInfo)[teamIndex]][elementIndex]
    });
  },

  getPlayerDetail(element) {
    get('common/qryPlayerDetailData', {
        element: element
      })
      .then(res => {
        this.setData({
          playerDetailData: res.data
        });
      })
  },

})