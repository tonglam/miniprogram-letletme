import {
  get
} from '../../../utils/request';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 公共数据
    gw: 0,
    tab: 'summary',
    // summary页
    summaryData: {},
    // dreamTeam页
    dreamTeamGkpList: [],
    dreamTeamDefList: [],
    dreamTeamMidList: [],
    dreamTeamFwdList: [],
    // elite页
    eliteElmentList: [],
    // transfers页
    transfersInList: [],
    transfersOutList: [],
    // refresh
    pullDownRefresh: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      gw: app.globalData.gw,
    });
    // 拉取总结
    this.initSummary();
    // 拉取梦之队
    this.initDreamTeam();
    // 拉取高分球员
    this.initEliteElements();
    // 拉取转会
    this.initEventTransfers();
    // 设置标题
    this.setNavTitle();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 刷新
    this.refreshEventOverallSummary();
  },

  onShareAppMessage: function () {

  },


  /**
   * 操作
   */

  // 标签页切换
  tabOnChange(event) {
    let tab = event.detail.name;
    this.setData({
      tab: tab
    });
    this.setNavTitle();
  },

  // 设置导航栏标题
  setNavTitle() {
    let tab = this.data.tab,
      title = "";
    switch (tab) {
      case 'summary': {
        title = "总结";
        break;
      }
      case 'dreamTeam': {
        title = "GW" + this.data.gw + " - 梦之队";
        break;
      }
      case 'elite': {
        title = "GW" + this.data.gw + " - 高分球员";
        break;
      }
      case 'transfers': {
        title = "GW" + this.data.gw + " - 转会榜";
        break;
      }
    }
    wx.setNavigationBarTitle({
      title: title
    });
  },

  /**
   * 数据
   */

  refreshEventOverallSummary() {
    get('summary/refreshEventOverallSummary', {
        event: this.data.gw
      }, false)
      .then(() => {
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
        // 拉取总结
        this.initSummary();
        // 拉取梦之队
        this.initDreamTeam();
        // 拉取高分球员
        this.initEliteElements();
        // 拉取转会
        this.initEventTransfers();
      });
  },

  initSummary() {
    get('summary/qryEventOverallResult', {
        event: this.data.gw
      })
      .then(res => {
        let data = res.data;
        this.setData({
          summaryData: data
        })
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  initDreamTeam() {
    get('summary/qryEventDreamTeam', {
        event: this.data.gw
      })
      .then(res => {
        let list = res.data,
          gkpList = [],
          defList = [],
          midList = [],
          fwdList = [];
        list.forEach(element => {
          let elementType = element.elementType;
          switch (elementType) {
            case 1: {
              gkpList.push(element);
              break;
            }
            case 2: {
              defList.push(element);
              break;
            }
            case 3: {
              midList.push(element);
              break;
            }
            case 4: {
              fwdList.push(element);
              break;
            }
          }
        });
        this.setData({
          dreamTeamGkpList: gkpList,
          dreamTeamDefList: defList,
          dreamTeamMidList: midList,
          dreamTeamFwdList: fwdList
        })
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  initEliteElements() {
    get('summary/qryEventEliteElements', {
        event: this.data.gw
      })
      .then(res => {
        let list = res.data;
        this.setData({
          eliteElmentList: list
        });
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  initEventTransfers() {
    get('summary/qryEventOverallTransfers', {
        event: this.data.gw
      })
      .then(res => {
        let map = res.data,
          transfersInList = map["transfers_in"],
          transfersOutList = map["transfers_out"]
        this.setData({
          transfersInList: transfersInList,
          transfersOutList: transfersOutList
        });
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

})