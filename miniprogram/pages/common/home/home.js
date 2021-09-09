import {
  get
} from '../../../utils/request';
import {
  delay,
  diffDeadlineTime,
  redirectToEntryInput
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 公共数据
    gw: 0,
    lastGw: 0,
    nextGw: 0,
    entry: 0,
    entryInfoData: {},
    titleGw: 0,
    title: '',
    tab: 'index',
    // index页
    time: 0,
    deadline: "",
    timeData: {},
    fixtureList: [],
    // dreamTeam页
    dreamTeamGkpList: [],
    dreamTeamDefList: [],
    dreamTeamMidList: [],
    dreamTeamFwdList: [],
    // elite页
    eliteElmentGkpList: [],
    eliteElmentDefList: [],
    eliteElmentMidList: [],
    eliteElmentFwdList: [],
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
    // 设置
    delay(400).then(() => {
      this.setData({
        gw: app.globalData.gw,
        lastGw: app.globalData.lastGw,
        nextGw: app.globalData.nextGw,
        entry: app.globalData.entry,
        entryInfoData: app.globalData.entryInfoData,
        deadline: app.globalData.deadline,
        time: diffDeadlineTime(app.globalData.utcDeadline)
      });
      if (this.data.entry <= 0) {
        redirectToEntryInput();
      }
      // 拉取赛程
      this.initNextGwFixture();
      // 拉取梦之队
      this.initDreamTeam();
      // 拉取高分球员
      this.initEliteElements();
      // 拉取转会
      this.initEventTransfers();
      // 设置标题
      this.setNavTitle();
    });
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 刷新gw
    this.refreshEventAndDeadline();
    // 拉取gw数据
    app.setCurrentEventAndNextUtcDeadline();
    delay(400).then(() => {
      this.setData({
        gw: app.globalData.gw,
        lastGw: app.globalData.lastGw,
        nextGw: app.globalData.nextGw,
        entry: app.globalData.entry,
        entryName: app.globalData.entryInfoData.entryName,
        deadline: app.globalData.deadline,
        time: diffDeadlineTime(app.globalData.utcDeadline),
      });
      // 拉取赛程
      this.initNextGwFixture();
      // 拉取梦之队
      this.initDreamTeam();
      // 拉取高分球员
      this.initEliteElements();
      // 拉取转会
      this.initEventTransfers();
    });
  },

  /**
   * 操作
   */

  // 设置导航栏标题
  setNavTitle() {
    let tab = this.data.tab;
    switch (tab) {
      case 'index': {
        let entryName = this.data.entryInfoData.entryName;
        if (entryName === '' || typeof entryName === 'undefined') {
          this.initEntryInfo();
        }
        this.setData({
          titleGw: this.data.gw,
          title: entryName
        });
        break;
      }
      case 'dreamTeam': {
        this.setData({
          titleGw: this.data.lastGw,
          title: "GW" + this.data.lastGw + " - 梦之队"
        });
        break;
      }
      case 'elite': {
        this.setData({
          titleGw: this.data.lastGw,
          title: "GW" + this.data.lastGw + " - 高分球员"
        });
        break;
      }
      case 'transfers': {
        this.setData({
          titleGw: this.data.lastGw,
          title: "GW" + this.data.lastGw + " - 转会榜"
        });
        break;
      }
    }
  },

  // 标签页切换
  tabOnChange(event) {
    let tab = event.detail.name;
    this.setData({
      tab: tab
    });
    this.setNavTitle();
  },

  // 页面切换
  onSwipperChange(event) {
    let tab = event.detail.currentItemId;
    if (tab === '') {
      return false;
    }
    this.setData({
      tab: tab
    });
    if (tab === 'fixture' && this.data.fixtureList.length === 0) {
      // 拉取赛程
      this.initNextGwFixture();
    } else if (tab === 'dreamTeam' && this.data.dreamTeamGkpList.length === 0) {
      // 拉取梦之队
      this.initDreamTeam();
    } else if (tab === 'elite' && this.data.eliteElmentGkpList.length === 0) {
      // 拉取高分球员
      this.initEliteElements();
    } else if (tab === 'transfers' && this.data.transfersInList.length === 0) {
      // 拉取高分球员
      this.initEliteElements();
    }
  },

  // 倒计时变化
  onChange(event) {
    this.setData({
      timeData: event.detail,
    });
  },

  // 重新输入team_id
  onClickChangeEntry() {
    // 清缓存
    wx.setStorageSync('entry', 0);
    // 清全局变量
    app.globalData.entry = 0;
    app.globalData.entryInfoData = {};
    // 跳转输入
    redirectToEntryInput();
  },

  /**
   * 数据
   */

  refreshEventAndDeadline() {
    get('common/refreshEventAndDeadline')
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
      });
  },

  initNextGwFixture() {
    get('common/qryNextFixture', {
        event: this.data.gw
      })
      .then(res => {
        this.setData({
          fixtureList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  initEntryInfo() {
    get('entry/qryEntryInfo', {
        entry: this.data.entry
      }, false)
      .then(res => {
        let data = res.data;
        this.setData({
          entryInfoData: data,
          titleGw: this.data.gw,
          title: data.entryName
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initDreamTeam() {
    get('common/qryEventDreamTeam', {
        event: this.data.lastGw
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
    get('common/qryEventEliteElements', {
        event: this.data.lastGw
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
          eliteElmentGkpList: gkpList,
          eliteElmentDefList: defList,
          eliteElmentMidList: midList,
          eliteElmentFwdList: fwdList,
        });
      })
      .catch(res => {
        console.log('fail:', res);
      })
  },

  initEventTransfers() {
    get('common/qryEventOverallTransfers', {
      event: this.data.lastGw
    })
    .then(res => {
      let list = res.data,
        inList = [],
        outList = []
      list.forEach(element => {
 
      this.setData({
     
      })
    })
    .catch(res => {
      console.log('fail:', res);
    })
  },

});