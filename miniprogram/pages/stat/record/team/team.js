import {
  get
} from '../../../utils/request';

Page({

  data: {
    season: '',
    event: 0,
    teamHId: 0,
    teamAId: 0,
    resultList: [],
  },

  /**
   * 原生
   */

  onLoad: function (options) {
    if (JSON.stringify(options) !== '{}') { // 传入要查询的teamId和againstId
      let season = options.season, event = parseInt(options.event), teamHId = parseInt(options.teamHId), teamAId = parseInt(options.teamAId);
      this.setData({
        season: season,
        event: event,
        teamHId: teamHId,
        teamAId: teamAId
      });

      // 设置标题
      wx.setNavigationBarTitle({
        title: entryInfoData.playerName,
      });
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
      event: this.data.event,
      teamHId: this.data.teamHId,
      teamAId: this.data.teamAId
    })
      .then(res => {
        this.setData({
          resultList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})