import {
  get,
  post
} from '../../../utils/request';
import {
  numAdd,
  numSub
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    // 公共数据
    gw: 0,
    nextGw: 0,
    deadline: "",
    // 推荐页数据
    elementType: 0,
    scoutEntry: {}, // 当前球探
    scoutList: [], // 所有球探
    transfers: 0,
    leftTransfers: -1,
    showLeftTransfers: '∞',
    fund: 28,
    pickGkpInfo: {},
    pickDefInfo: {},
    pickMidInfo: {},
    pickFwdInfo: {},
    pickCapInfo: {},
    // 推荐页垃圾双向绑定
    pickGkp: "",
    pickGkpPrice: "",
    pickDef: "",
    pickDefPrice: "",
    pickMid: "",
    pickMidPrice: "",
    pickFwd: "",
    pickFwdPrice: "",
    pickCap: "",
    pickCapPrice: "",
    reason: "",
    // 得分页数据
    seasonResultList: [],
    scoutResultList: [],
    resultGw: 0,
    // picker
    showPlayerPicker: false,
    showGwPicker: false,
    // tabBar
    tab: "推荐",
    // refrsh
    pullDownRefresh: false,
    // chart
    chartShow: false,
  },

  /**
   * 原生
   */

  onShow() {
    this.setData({
      gw: app.globalData.gw,
      deadline: app.globalData.deadline,
      nextGw: app.globalData.nextGw,
      resultGw: app.globalData.gw
    });
    // 拉取球探名单
    this.initScout();
    // 拉取当前球探推荐结果
    this.initEntryScoutResult();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 更新球探结果
    this.updateEventScoutResult(this.data.resultGw);
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作（公共）
   */

  // tab切换
  tabOnChange(event) {
    let tab = event.detail.name,
      resultGw = this.data.resultGw;
    if (tab === '推荐') {
      this.setData({
        chartShow: false
      });
    } else if (tab === '得分') {
      this.setData({
        chartShow: false
      });
      if (this.data.scoutResultList.length === 0) {
        this.initEventScoutResult(resultGw);
      }
    } else if (tab === '排行') {
      this.setData({
        chartShow: true
      });
      // season
      if (this.data.seasonResultList.length === 0) {
        this.initSeasonScoutResult();
      } else {
        this.initSeasonChart();
      }
      // scout event result
      if (this.data.scoutResultList.length === 0) {
        this.initEventScoutResult(resultGw);
      } else {
        this.initEventChart();
      }
    }
  },

  /**
   * 操作（推荐页）
   */

  // 推荐重选
  onClickRefresh() {
    this.initEntryScoutResult();
  },

  // 推荐提交
  onClickConfirm() {
    if (!this.checkScout()) {
      Toast.fail('请先加入让让群球探');
      return false;
    }
    let scoutData = {
      event: app.globalData.nextGw,
      entry: this.data.scoutEntry.entry,
      scoutName: this.data.scoutEntry.name,
      transfers: this.data.transfers,
      leftTransfers: this.data.leftTransfers,
      gkp: this.data.pickGkpInfo.element,
      def: this.data.pickDefInfo.element,
      mid: this.data.pickMidInfo.element,
      fwd: this.data.pickFwdInfo.element,
      captain: this.data.pickCapInfo.element,
      reason: this.data.reason,
    };
    if (scoutData.gkp === '' || scoutData.gkp === undefined ||
      scoutData.def === '' || scoutData.def === undefined ||
      scoutData.mid === '' || scoutData.mid === undefined ||
      scoutData.fwd === '' || scoutData.fwd === undefined ||
      scoutData.captain === '' || scoutData.captain === undefined) {
      Toast.fail('还没选完呢');
      return false;
    }
    post('group/upsertEventScout', scoutData)
      .then(res => {
        if (res.data.code === 200) {
          Toast.success('提交成功');
        } else {
          Toast.fail('提交失败');
        }
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 检查时候否为球探
  checkScout() {
    if (this.data.scoutList.indexOf(this.data.scoutEntry.entry + '') != -1) {
      return true;
    }
    return false;
  },

  // 选择推荐球员 
  onPickScoutPlayer(event) {
    // 计算换人名额
    let transfers = this.data.transfers,
      leftTransfers = this.data.leftTransfers,
      showLeftTransfers = this.data.showLeftTransfers;
    if (leftTransfers === 0) {
      Toast.fail('没有名额啦');
      return false;
    }
    if (leftTransfers !== -1) {
      transfers = transfers + 1;
      leftTransfers = leftTransfers - 1;
      showLeftTransfers = this.getShowLeftTransfers(leftTransfers);
      this.setData({
        transfers: transfers,
        leftTransfers: leftTransfers,
        showLeftTransfers: showLeftTransfers
      });
    }
    this.setData({
      elementType: event.currentTarget.id,
      showPlayerPicker: true,
    });
  },

  // 球员选择回填
  onPickResult(event) {
    this.setData({
      showPlayerPicker: false
    });
    if (event.detail === '' || event.detail === null) {
      return false;
    }
    let playerInfo = event.detail,
      teamShortName = playerInfo.teamShortName,
      webName = playerInfo.webName,
      price = playerInfo.price,
      elementType = this.data.elementType;
    // 校验
    let fund = this.calcLeftFund(this.data.fund, elementType, price);
    if (!this.checkAvailable(webName, elementType, fund)) {
      return false;
    }
    // 设置
    switch (parseInt(elementType)) {
      case 1:
        this.setData({
          pickGkpInfo: playerInfo,
          pickGkpPrice: price,
          pickGkp: this.setShowWebName(teamShortName, webName, price),
          fund: fund
        });
        break;
      case 2:
        this.setData({
          pickDefInfo: playerInfo,
          pickDefPrice: price,
          pickDef: this.setShowWebName(teamShortName, webName, price),
          fund: fund
        });
        break;
      case 3:
        this.setData({
          pickMidInfo: playerInfo,
          pickMidPrice: price,
          pickMid: this.setShowWebName(teamShortName, webName, price),
          fund: fund
        });
        break;
      case 4:
        this.setData({
          pickFwdInfo: playerInfo,
          pickFwdPrice: price,
          pickFwd: this.setShowWebName(teamShortName, webName, price),
          fund: fund
        });
        break;
      case 5:
        this.setData({
          pickCapInfo: playerInfo,
          pickCapPrice: price,
          pickCap: this.setShowWebName(teamShortName, webName, price)
        });
        break;
      default:
        console.log('method: onPickResult, something wrong');
    }
  },

  // 检查规则
  checkAvailable(webName, elementType, fund) {
    // 队长不能重复
    if (webName === this.data.pickCapInfo.webName) {
      Toast.fail('选择的队员不能和队长重复');
      return false;
    }
    if (parseInt(elementType) === 5) {
      if (webName === this.data.pickGkpInfo.webName ||
        webName === this.data.pickDefInfo.webName ||
        webName === this.data.pickMidInfo.webName ||
        webName === this.data.pickFwdInfo.webName) {
        Toast.fail('选择的队长不能和队员重复');
        return false;
      }
    }

    // 检查重复
    switch (parseInt(elementType)) {
      case 1:
        if (webName === this.data.pickGkpInfo.webName) {
          Toast.fail('选了一样的');
          return false;
        }
        // 检查余额
        if (fund < 0) {
          Toast.fail('钱不够啦');
          return false;
        }
        case 2:
          if (webName === this.data.pickGkpInfo.webName) {
            Toast.fail('选了一样的');
            return false;
          }
          // 检查余额
          if (fund < 0) {
            Toast.fail('钱不够啦');
            return false;
          }
          case 3:
            if (webName === this.data.pickGkpInfo.webName) {
              Toast.fail('选了一样的');
              return false;
            }
            // 检查余额
            if (fund < 0) {
              Toast.fail('钱不够啦');
              return false;
            }
            case 4:
              if (webName === this.data.pickGkpInfo.webName) {
                Toast.fail('选了一样的');
                return false;
              }
              // 检查余额
              if (fund < 0) {
                Toast.fail('钱不够啦');
                return false;
              }
              default:
                return true;
    }
  },

  // 资金计算
  calcLeftFund(fund, elementType, price) {
    let oldPrice = 0;
    switch (parseInt(elementType)) {
      case 1:
        oldPrice = this.data.pickGkpPrice;
        return numSub(numAdd(fund, oldPrice), price);
      case 2:
        oldPrice = this.data.pickDefPrice;
        return numSub(numAdd(fund, oldPrice), price);
      case 3:
        oldPrice = this.data.pickMidPrice;
        return numSub(numAdd(fund, oldPrice), price);
      case 4:
        oldPrice = this.data.pickFwdPrice;
        return numSub(numAdd(fund, oldPrice), price);
    }
    return fund;
  },

  // 显示的名字
  setShowWebName(teamShortName, webName, price) {
    return "【" + teamShortName + "】" + webName + "  " + "£" + price + "m";
  },

  /**
   * 数据（推荐页）
   */

  // 展示的换人名额
  getShowLeftTransfers(leftTransfers) {
    if (leftTransfers === -1) {
      return '∞';
    }
    return leftTransfers + '';
  },

  // 拉取球探信息
  initScout() {
    get('group/qryScoutEntry')
      .then(res => {
        let entry = app.globalData.entryInfoData.entry;
        if (Object.keys(res.data).indexOf(entry + '') != -1) {
          let scoutEntry = {
            entry: entry,
            name: res.data[entry]
          };
          this.setData({
            scoutList: Object.keys(res.data),
            scoutEntry: scoutEntry
          });
        }
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 拉取推荐结果
  initEntryScoutResult() {
    get('group/qryEventEntryScoutResult', {
        event: this.data.nextGw,
        entry: app.globalData.entry
      })
      .then(res => {
        let data = res.data,
          transfers = data.transfers,
          leftTransfers = data.leftTransfers,
          showLeftTransfers = this.getShowLeftTransfers(data.leftTransfers);
        this.setData({
          transfers: transfers,
          leftTransfers: leftTransfers,
          showLeftTransfers: showLeftTransfers
        });
        this.setInitData(data);
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  setInitData(data) {
    let fund = this.data.fund,
      gkpInfo = data.gkpInfo,
      defInfo = data.defInfo,
      midInfo = data.midInfo,
      fwdInfo = data.fwdInfo,
      captainInfo = data.captainInfo;
    if (gkpInfo !== null && gkpInfo.element > 0) {
      fund = this.calcLeftFund(fund, gkpInfo.elementType, gkpInfo.price);
      this.setData({
        pickGkp: this.setShowWebName(gkpInfo.teamShortName, gkpInfo.webName, gkpInfo.price),
        pickGkpPrice: gkpInfo.price,
        pickGkpInfo: gkpInfo
      });
    } else {
      fund = this.calcLeftFund(fund, 1, 0);
      this.setData({
        pickGkp: "",
        pickGkpPrice: "",
        pickGkpInfo: {}
      });
    }
    if (defInfo !== null && defInfo.element > 0) {
      fund = this.calcLeftFund(fund, defInfo.elementType, defInfo.price);
      this.setData({
        pickDef: this.setShowWebName(defInfo.teamShortName, defInfo.webName, defInfo.price),
        pickDefPrice: defInfo.price,
        pickDefInfo: defInfo,
      });
    } else {
      fund = this.calcLeftFund(fund, 2, 0);
      this.setData({
        pickDef: "",
        pickDefPrice: "",
        pickDefInfo: {}
      });
    }
    if (midInfo !== null && midInfo.element > 0) {
      fund = this.calcLeftFund(fund, midInfo.elementType, midInfo.price);
      this.setData({
        pickMid: this.setShowWebName(midInfo.teamShortName, midInfo.webName, midInfo.price),
        pickMidPrice: midInfo.price,
        pickMidInfo: midInfo
      });
    } else {
      fund = this.calcLeftFund(fund, 3, 0);
      this.setData({
        pickMid: "",
        pickMidPrice: "",
        pickMidInfo: {}
      });
    }
    if (fwdInfo !== null && fwdInfo.element > 0) {
      fund = this.calcLeftFund(fund, fwdInfo.elementType, fwdInfo.price);
      this.setData({
        pickFwd: this.setShowWebName(fwdInfo.teamShortName, fwdInfo.webName, data.fwdInfo.price),
        pickFwdPrice: fwdInfo.price,
        pickFwdInfo: fwdInfo
      });
    } else {
      fund = this.calcLeftFund(fund, 4, 0);
      this.setData({
        pickFwd: "",
        pickFwdPrice: "",
        pickFwdInfo: {}
      });
    }
    if (captainInfo !== null && captainInfo.element > 0) {
      this.setData({
        pickCap: this.setShowWebName(captainInfo.teamShortName, captainInfo.webName, data.captainInfo.price),
        pickCapPrice: captainInfo.price,
        pickCapInfo: captainInfo
      });
    } else {
      this.setData({
        pickCap: "",
        pickCapPrice: "",
        pickCapInfo: {}
      });
    }
    this.setData({
      fund: fund,
      reason: data.reason
    });
  },

  /**
   * 操作（得分页）
   */

  // 更换比赛周
  onClickChangeGw() {
    // 调gwPicker
    this.setData({
      showGwPicker: true
    });
  },

  // GW选择回填
  onPickGw(event) {
    this.setData({
      showGwPicker: false
    });
    let gw = event.detail;
    if (gw === '' || gw === null) {
      return false;
    }
    if (gw === this.data.resultGw) {
      return false;
    }
    this.setData({
      resultGw: gw
    });
    // 更新得分数据
    this.changeEventScoutResult(gw);
  },

  /**
   * 数据（得分页）
   */

  // 拉取比赛周所有推荐结果 
  initEventScoutResult(gw) {
    get('group/qryEventScoutResult', {
        event: gw,
      })
      .then(res => {
        // 下拉刷新
        if (this.data.pullDownRefresh) {
          wx.stopPullDownRefresh({
            success: () => {
              Toast({
                type: 'success',
                duration: 400,
                message: "刷新成功"
              });
              this.setData({
                pullDownRefresh: false
              });
            },
          });
        }
        let list = res.data;
        if (list.length === 0) {
          Toast('无数据');
          return false;
        }
        // 画图
        if (gw === 0) {
          this.setData({
            seasonResultList: list
          });
          this.initSeasonChart();
        } else {
          this.setData({
            scoutResultList: list
          });
          this.initEventChart();
        }
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 下拉刷新比赛周推荐结果
  updateEventScoutResult(gw) {
    if (gw === this.data.gw) { // 当前周才刷新event_live
      get('common/insertEventLiveCache', {
          event: gw
        }, false)
        .then(() => {
          this.changeEventScoutResult(gw);
        })
        .catch(res => {
          console.log('fail:', res);
        });
    } else {
      this.changeEventScoutResult(gw);
    }

  },

  // 更新当前周得分数据
  changeEventScoutResult(gw) {
    get('group/updateEventScoutResult', {
        event: gw
      })
      .then(() => {
        this.initEventScoutResult(gw);
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 更新赛季得分数据
  initSeasonScoutResult() {
    this.initEventScoutResult(0);
  },

  /**
   * 画图
   */

  initSeasonChart() {
    if (this.data.chartShow) {
      this.selectComponent('#seasonResultChart').setData({
        resultList: this.data.seasonResultList
      });
    }
  },

  initEventChart() {
    if (this.data.chartShow) {
      this.selectComponent('#eventResultChart').setData({
        resultList: this.data.scoutResultList
      });
    }
  },

})