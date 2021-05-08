import { get } from '../../utils/https'

const position = {
  'GKP': 1,
  'DEF': 2,
  'MID': 3,
  'FWD': 4
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playerInfoMap: {},
    columns: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlayerInfo(1);
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    if (index == 0) {
      this.getPlayerInfo(position[value[0]]);
    } else if (index == 1) {
      picker.setColumnValues(2, this.data.playerInfoMap[value[1]].map(o => o.webName));
    }
  },

  onConfirm(event) {
  },

  onCancel() {
  },

  getPlayerInfo(elementType) {
    get('common/qryPlayerInfoByElementType', { elementType: elementType })
      .then(res => {
        this.setData({
          playerInfoMap: res.data
        });
        this.initColumns();
      });
  },

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
    })
  }

})