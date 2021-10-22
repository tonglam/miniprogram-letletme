import {
  get
} from '../../../../utils/request';

Page({

  data: {
    season: '',
    gw: 0,
    teamId: 0,
    teamShortName:'',
    againstId: 0,
    elementCode: 0,
    title: '',
    playerInfo: {},
    recordList: []
  },

  /**
   * 原生
   */

  onLoad: function (options) {
    if (JSON.stringify(options) !== '{}') { // 传入要查询的teamId和againstId
      let teamId = parseInt(options.teamId), againstId = parseInt(options.againstId), elementCode = parseInt(options.elementCode),teamShortName =options.teamShortName ;
      this.setData({
        teamId: teamId,
        againstId: againstId,
        elementCode: elementCode,
        teamShortName:teamShortName
      });
      // 拉取数据
      this.initElementAgainstRecord();
    }
  },

  onShareAppMessage: function () {

  },

  /**
    * 数据（得分页）
    */

  // 对阵记录结果
  initElementAgainstRecord() {
    get('stat/qryElementAgainstRecord', {
      teamId: this.data.teamId,
      againstId: this.data.againstId,
      elementCode: this.data.elementCode
    })
      .then(res => {
        let list = res.data, playerInfo = list[0], title = playerInfo.teamHShortName + " " + playerInfo.teamHScore + "-" + playerInfo.teamAShortName + " " + playerInfo.teamAScore;
        this.setData({
          title: title,
          playerInfo: playerInfo,
          recordList: list
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})