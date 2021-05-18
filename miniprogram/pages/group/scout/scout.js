const app = getApp();

import {
  get,
  post
} from '../../../utils/request';
import {
  numAdd,
  numSub
} from '../../../utils/utils';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import * as echarts from '../../../ec-canvas/echarts';

let chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new 
  });
  canvas.setChart(chart);
  let option = {
    title: {
      text: 'GW36'
    },
    tooltip: {},
    legend: {},
    xAxis: {},
    yAxis: {},
    series: [{
      name: '',
      type: 'bar',
      data: [
        ["studge", 18],
        ["Menyo2daye", 23],
        ["Mighty Reds", 17],
        ["让让群の伯恩茅斯一美", 24],
        ["tong话里都是骗人的", 28],
        ["让让群女法官", 16],
        ["让让群老股民", 31]
      ],
      showBackground: true,
      label: {
        show: true
      }
    }]
  };
  chart.setOption(option);
  return chart;
}

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
    scoutResultList: [],
    resultGw: 0,
    // picker
    showPlayerPicker: false,
    showGwPicker: false,
    showResult: false,
    // tabBar
    tab: "排行",
    // refrsh
    pullDownRefresh: false,
    // echart 
    chartShow: false,
    ec: {
      onInit: initChart
    },
  },

  /**
  * 原生
  */

  onShow() {
    this.setData({
      gw: app.globalData.gw,
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
    this.updateEventScoutResult();
  },

  /**
   * 操作（公共）
  */

  // tabBar切换
  tabBarOnChange(event) {
    let tab = event.detail.name;
    if (tab === '推荐') {
      this.setData({
        chartShow: false
      });
    } else if (tab === '得分') {
      this.setData({
        showResult: true,
        chartShow: false
      });
      if (this.data.scoutResultList.length === 0) {
        this.initEventScoutResult();
      }

    } else if (tab === '排行')
      this.setData({
        chartShow: true
      });
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

  checkScout() {
    if (this.data.scoutList.indexOf(this.data.scoutEntry.entry + '') != -1) {
      return true;
    }
    return false;
  },

  // 选择推荐球员 
  onPickScoutPlayer(event) {
    this.setData({
      elementType: event.currentTarget.id,
      showPlayerPicker: true
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
      Toast.fail('选择的队长不能和队员重复');
      return false;
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
      entry: app.globalData.entryInfoData.entry
    })
      .then(res => {
        this.setInitData(res.data);
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
    }
    if (defInfo !== null && defInfo.element > 0) {
      fund = this.calcLeftFund(fund, defInfo.elementType, defInfo.price);
      this.setData({
        pickDef: this.setShowWebName(defInfo.teamShortName, defInfo.webName, defInfo.price),
        pickDefPrice: defInfo.price,
        pickDefInfo: defInfo,
      });
    }
    if (midInfo !== null && midInfo.element > 0) {
      fund = this.calcLeftFund(fund, midInfo.elementType, midInfo.price);
      this.setData({
        pickMid: this.setShowWebName(midInfo.teamShortName, midInfo.webName, midInfo.price),
        pickMidPrice: midInfo.price,
        pickMidInfo: midInfo
      });
    }
    if (fwdInfo !== null && fwdInfo.element > 0) {
      fund = this.calcLeftFund(fund, fwdInfo.elementType, fwdInfo.price);
      this.setData({
        pickFwd: this.setShowWebName(fwdInfo.teamShortName, fwdInfo.webName, data.fwdInfo.price),
        pickFwdPrice: fwdInfo.price,
        pickFwdInfo: fwdInfo
      });
    }
    if (captainInfo !== null && captainInfo.element > 0) {
      this.setData({
        pickCap: this.setShowWebName(captainInfo.teamShortName, captainInfo.webName, data.captainInfo.price),
        pickCapPrice: captainInfo.price,
        pickCapInfo: captainInfo
      });
    }
    this.setData({
      fund: fund,
      reason: data.reason
    });
  },

  // 拉取比赛周所有推荐结果 
  initEventScoutResult() {
    get('group/qryEventScoutResult', {
      event: this.data.gw,
    })
      .then(res => {
        let list = res.data;
        if (list.length === 0) {
          Toast('无数据');
        }
        this.setData({
          scoutResultList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
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
    this.updateEventScoutResult(gw);
  },

  /**
  * 数据（得分页）
  */

  // 更新当前周得分数据
  updateEventScoutResult() {
    let gw = this.data.gw;
    get('common/insertEventLiveCache', {
      event: gw
    },false)
      .then(() => {
        get('group/updateEventScoutResult', {
          event: gw
        })
          .then(() => {
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
            this.initEventScoutResult();
          })
          .catch(res => {
            console.log('fail:', res);
          });
      })
  },


})