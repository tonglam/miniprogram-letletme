import {
  get
} from "../../../utils/request";
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    gw: 0,
    groupTournamentId: 1,
    resultList: [],
    rankList: [],
    // tab
    tab: 'live',
    // refrsh
    pullDownRefresh: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      gw: app.globalData.gw
    });
    // 拉取结果
    this.initResult();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.refreshResult();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // 标签页切换
  tabOnChange(event) {
    let name = event.detail.name;
    this.setData({
      tab: name
    });
    if (name === 'live') {
      if (this.data.resultList.length === 0) {
        // 实况
        this.initResult();
      }
    } else if (name === 'result') {
      // 积分榜
      if (this.data.resultList.length === 0) {
        this.initResult();
      }
    }
  },

  /**
   * 数据
   */

  initResult() {
    get('group_tournament/getEventGroupTournamentResult', {
        groupTournamentId: this.data.groupTournamentId,
        event: this.data.gw
      })
      .then(res => {
        // 下拉刷新
        if (this.data.pullDownRefresh) {
          wx.stopPullDownRefresh({
            success: () => {
              Toast({
                type: 'success',
                duration: 1000,
                message: "刷新成功"
              });
              this.setData({
                pullDownRefresh: false
              });
            },
          });
        }
        let list = res.data;
        let resultList = list.slice().sort((a, b) => a.groupId - b.groupId),
          rankList = list.slice().sort((a, b) => a.rank - b.rank);
        resultList.forEach((group) => {
          group.eventResultList.forEach((data) => {
            if (data.entry === group.captainId) {
              data.entryName = '(c) ' + data.entryName
            }
          });
        });
        this.setData({
          resultList: resultList,
          rankList: rankList
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 刷新数据
  refreshResult() {
    get('group_tournament/refreshGroupTournamentResult', {
        tournamentId: this.data.tournamentId,
        event: this.data.gw
      }, false)
      .then(() => {
        this.initResult();
      });
  },

})