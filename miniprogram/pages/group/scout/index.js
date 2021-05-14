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

Page({

  data: {
    // 公共
    gw: 0,
    deadline: "",
    elementType: 0,
    showPlayerPicker: false,
    showGwPicker: false,
    showResult: false,
    // 推荐页
    scoutResultList: [],
    scoutEntry: {},
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
    // tabBar
    tab: "推荐",
    // 得分页
    resultGw: 0,
    // action
    showActionSheet: false,
    actions: [{
      name: '刷新得分'
    }, {
      name: '切换GW'
    }],
  },

  onLoad() {
    this.setData({
      gw: app.globalData.gw,
      resultGw: app.globalData.gw
    });
    this.initScout();
    this.initEntryScoutResult();
  },

  // tabBar
  tabBarOnChange(event) {
    let tab = event.detail.name;
    if (tab === '得分') {
      this.setData({
        showResult: true
      });
      if (this.data.scoutResultList.length === 0) {
        this.initEventScoutResult();
      }
    } else if (tab === '排行')
      console.log("tab切换到排行");
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
      event: app.globalData.nextGw,
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

  // 推荐结果 
  initEventScoutResult() {
    let gw = app.globalData.gw;
    this.getEventScoutResult(gw);
  },

  // 拉取比赛周所有推荐结果 
  getEventScoutResult(gw) {
    get('group/qryEventScoutResult', {
      event: parseInt(gw),
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

  // 选择推荐球员
  getScoutPlayer(event) {
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

  setShowWebName(teamShortName, webName, price) {
    return "【" + teamShortName + "】" + webName + "  " + "£" + price + "m";
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
    switch (elementType) {
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

  // 提交
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

  // 重选
  onClickRefresh() {
    this.initEntryScoutResult();
  },

  // tab(得分)

  // 按钮
  onScoreClick() {
    this.setData({
      showActionSheet: true
    });
  },

  // 关闭action
  onActionSheetClose() {
    this.setData({
      showActionSheet: false
    });
  },

  // action选择
  onSelect(event) {
    let action = event.detail.name;
    if (action === this.data.actions[0].name) { // 刷新得分
      this.updateEventScoutResult();
    } else if (action === this.data.actions[1].name) { // 切换gw
      // 调gwPicker
      this.setData({
        showGwPicker: true
      });
    }
  },

  // 更新当前周得分数据
  updateEventScoutResult() {
    get('group/updateEventScoutResult', {
      event: app.globalData.gw
    })
      .then(() => {
        Toast.success('更新成功');
      })
      .catch(res => {
        console.log('fail:', res);
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
    this.getEventScoutResult(gw);
  },

})