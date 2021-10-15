import {
  get
} from '../../../utils/request';

Page({

  data: {
    title: '',
    season: '',
    teamId: 0,
    againstId: 0,
    teamHId: 0,
    teamAId: 0,
    active: true,
    infoData: {},
    resultList: [],
    topElementList: [],
  },

  /**
   * 原生
   */

  onLoad: function (options) {
    if (JSON.stringify(options) !== '{}') { // 传入要查询的teamId和againstId
      let title = options.title, teamId = parseInt(options.teamId), againstId = parseInt(options.againstId);
      this.setData({
        title: title,
        teamId: teamId,
        againstId: againstId
      });
    }
  },

  onShow: function () {
    this.initAgainstRecordInfo();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  /**
   * 数据（得分页）
   */

  // 对阵记录信息
  initAgainstRecordInfo() {
    get('stat/qryTeamAgainstRecordInfo', {
      teamId: this.data.teamId,
      againstId: this.data.againstId
    })
      .then(res => {
        this.setData({
          infoData: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 对阵记录得分结果
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

  // 对阵历史得分最高球员（active：现役球员）
  initTopElementAgainstRecord() {
    get('stat/qryTopElementTeamAgainstRecord', {
      teamId: this.data.teamId,
      againstId: this.data.againstId,
      active: this.data.active
    })
      .then(res => {
        this.setData({
          topElementList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})