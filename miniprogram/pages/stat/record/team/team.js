import {
  get
} from '../../../../utils/request';

Page({

  data: {
    season: '',
    gw: 0,
    title: '',
    teamHId: 0,
    teamAId: 0,
    resultList: [],
  },

  /**
   * 原生
   */

  onLoad: function (options) {
    if (JSON.stringify(options) !== '{}') { // 传入要查询的teamId和againstId
      let season = options.season, gw = parseInt(options.event), teamHId = parseInt(options.teamHId), teamAId = parseInt(options.teamAId);
      this.setData({
        season: season,
        gw: gw,
        teamHId: teamHId,
        teamAId: teamAId
      });
      // 拉取数据
      this.initAgainstRecordResult();
    }
  },

  onShareAppMessage: function () {

  },

  /**
    * 数据（得分页）
    */

  // 对阵记录结果
  initAgainstRecordResult() {
    get('stat/qryTeamAgainstRecordResult', {
      season: this.data.season,
      event: this.data.gw,
      teamHId: this.data.teamHId,
      teamAId: this.data.teamAId
    })
      .then(res => {
        let list = res.data, baseData = list[0], title = baseData.teamShortName + " " + baseData.teamScore + "-" + baseData.againstTeamScore + " " + baseData.againstTeamShortName;
        this.setData({
          title: title,
          resultList: list
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})