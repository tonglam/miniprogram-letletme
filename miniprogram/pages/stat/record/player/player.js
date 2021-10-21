import {
  get
} from '../../../utils/request';

Page({

  data: {

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

  onShareAppMessage: function () {

  },

})