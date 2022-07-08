import {
  get
} from "../../../utils/request";
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    gw: 0,
    tournamentId : 3,
    shuffledAList: [],
    shuffledBList: [],
    shuffledCList: [],
    shuffledDList: [],
    shuffledEList: [],
    groupAResult: [],
    groupBResult: [],
    groupCResult: [],
    groupAName: '',
    groupBName: '',
    groupCName: '',
    groupRankList: [],
    // tab
    tab: 'shuffled',
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
    // 实时团战
    this.initShuffled();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    let tab = this.data.tab;
    if (tab === 'shuffled') {
      // 团战
      this.refreshShuffled();
    } else if (tab === 'group') {
      // 排名
      this.refreshGroup();
    }
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
    if (name === 'shuffled') {
      // 团战
      this.initShuffled();
    } else if (name === 'group') {
      // 积分榜
      this.initGroupRank();
      // 排名
      this.initGroup();
    }
  },

  /**
   * 数据
   */

  // 团战
  initShuffled() {
    get('special_tournament/getShuffledGroupResult', {
        tournamentId: this.data.tournamentId,
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
        let map = res.data;
        this.setData({
          shuffledAList: map['1'],
          shuffledBList: map['2'],
          shuffledCList: map['3'],
          shuffledDList: map['4'],
          shuffledEList: map['5']
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 积分榜
  initGroupRank() {
    get('special_tournament/getGroupRankResult', {
        tournamentId: this.data.tournamentId,
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
        this.setData({
          groupRankList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 排名
  initGroup() {
    get('special_tournament/getEventGroupResult', {
        tournamentId: this.data.tournamentId,
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
        let map = res.data,
          groupAResult = map['0'],
          groupBResult = map['1'],
          groupCResult = map['2'];
        this.setData({
          groupAResult: groupAResult,
          groupBResult: groupBResult,
          groupCResult: groupCResult,
          groupAName: groupAResult.groupName,
          groupBName: groupBResult.groupName,
          groupCName: groupCResult.groupName,
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 刷新实时数据
  refreshLive() {
    let tab = this.data.tab;
    if (tab === 'shuffled') {
      this.refreshShuffled();
    } else if (tab === 'group') {
      this.refreshGroup();
    }
  },

  // 刷新团战数据
  refreshShuffled() {
    get('special_tournament/refreshShuffledGroupResult', {
        tournamentId: this.data.tournamentId,
        event: this.data.gw
      }, false)
      .then(() => {
        this.initShuffled();
      });
  },

  // 刷新排名数据
  refreshGroup() {
    get('special_tournament/refreshEventGroupResult', {
        tournamentId: this.data.tournamentId,
        event: this.data.gw
      }, false)
      .then(() => {
        // 积分榜
        this.initGroupRank();
        // 排名
        this.initGroup();
      });
  },

})