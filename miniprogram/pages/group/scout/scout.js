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
    elementType: 0,
    page: '../../group/scout/scout',
    showPicker: false,
    scoutList: [],
    scoutEntry: {},
    fund: 28,
    pickGkpInfo: {},
    pickDefInfo: {},
    pickMidInfo: {},
    pickFwdInfo: {},
    pickCapInfo: {},
    // 垃圾双向绑定
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

  },

  onLoad() {
    this.initScout();
    this.initScoutResult();
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
  initScoutResult() {
    get('group/qryEventEntryScoutResult', {
      event: app.globalData.gw,
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
    let fund = this.data.fund, gkpInfo = data.gkpInfo, defInfo = data.defInfo, midInfo = data.midInfo, fwdInfo = data.fwdInfo, captainInfo = data.captainInfo;
    if (gkpInfo.element > 0) {
      fund = this.calcLeftFund(fund,gkpInfo.elementType, gkpInfo.price);
      this.setData({
        pickGkp: this.setShowWebName(gkpInfo.webName, gkpInfo.price),
        pickGkpPrice: gkpInfo.price,
        pickGkpInfo: gkpInfo
      });
    }
    if (defInfo.element > 0) {
      fund = this.calcLeftFund(fund,defInfo.elementType, defInfo.price);
      this.setData({
        pickDef: this.setShowWebName(defInfo.webName, defInfo.price),
        pickDefPrice: defInfo.price,
        pickDefInfo: defInfo,
      });
    }
    if (midInfo.element > 0) {
      fund = this.calcLeftFund(fund,midInfo.elementType, midInfo.price);
      this.setData({
        pickMid: this.setShowWebName(midInfo.webName, midInfo.price),
        pickMidPrice: midInfo.price,
        pickMidInfo: midInfo
      });
    }
    if (fwdInfo.element > 0) {
      fund = this.calcLeftFund(fund,fwdInfo.elementType, fwdInfo.price);
      this.setData({
        pickFwd: this.setShowWebName(fwdInfo.webName, data.fwdInfo.price),
        pickFwdPrice: fwdInfo.price,
        pickFwdInfo: fwdInfo
      });
    }
    if (captainInfo.element > 0) {
      this.setData({
        pickCap: this.setShowWebName(captainInfo.webName, data.captainInfo.price),
        pickCapPrice: captainInfo.price,
        pickCapInfo: captainInfo
      });
    }
    this.setData({
      fund: fund
    });
  },

  // 选择推荐球员
  getScoutPlayer(event) {
    this.setData({
      elementType: event.currentTarget.id,
      showPicker: true
    });
  },

  // 球员选择回填
  onPickResult(event) {
    this.setData({
      showPicker: false
    });
    let entryInfo = event.detail,
      webName = entryInfo.webName,
      price = entryInfo.price,
      elementType = this.data.elementType;
    // 校验
    let fund = this.calcLeftFund(this.data.fund,elementType, price);
    if (!this.checkAvailable(webName, elementType, fund)) {
      return false;
    }
    // 设置
    switch (elementType) {
      case '1':
        this.setData({
          pickGkpInfo: entryInfo,
          pickGkpPrice: price,
          pickGkp: this.setShowWebName(webName, price),
          fund: fund
        });
        break;
      case '2':
        this.setData({
          pickDefInfo: entryInfo,
          pickDefPrice: price,
          pickDef: this.setShowWebName(webName, price),
          fund: fund
        });
        break;
      case '3':
        this.setData({
          pickMidInfo: entryInfo,
          pickMidPrice: price,
          pickMid: this.setShowWebName(webName, price),
          fund: fund
        });
        break;
      case '4':
        this.setData({
          pickFwdInfo: entryInfo,
          pickFwdPrice: price,
          pickFwd: this.setShowWebName(webName, price),
          fund: fund
        });
        break;
      case '5':
        this.setData({
          pickCapInfo: entryInfo,
          pickCapPrice: price,
          pickCap: this.setShowWebName(webName, price)
        });
        break;
      default:
        console.log('method: onPickResult, something wrong');
    }
  },

  setShowWebName(webName, price) {
    return webName + "  " + "£" + price + "m";
  },

  // 检查规则
  checkAvailable(webName, elementType, fund) {
    // 队长不能重复
    if (webName === this.data.pickGkpInfo.webName) {
      Toast.fail('选择的队长不能和队员重复');
      return false;
    }
    // 检查余额
    if (elementType === '1' || elementType === '2' || elementType === '3' || elementType === '4') {
      if (fund < 0) {
        Toast.fail('钱不够啦');
        return false;
      }
    }
    return true;
  },

  // 资金计算
  calcLeftFund(fund,elementType, price) {
    let oldPrice = 0;
    switch (elementType) {
      case '1':
        oldPrice = this.data.pickGkpPrice;
        break;
      case '2':
        oldPrice = this.data.pickDefPrice;
        break;
      case '3':
        oldPrice = this.data.pickMidPrice;
        break;
      case '4':
        oldPrice = this.data.pickFwdPrice;
        break;
    }
    return numSub(numAdd(fund, oldPrice), price);
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
    console.log(scoutData.gkp);
    if (scoutData.gkp === '' || scoutData.gkp === undefined ||
      scoutData.def === '' || scoutData.def === undefined ||
      scoutData.mid === '' || scoutData.mid === undefined ||
      scoutData.fwd === '' || scoutData.fwd === undefined ||
      scoutData.captain === '' || scoutData.captain === undefined) {
      Toast.fail('还没选完呢');
      return false;
    }
    post('group/upsertEventScout', {
      scoutData: scoutData
    })
      .then(res => {
        console.log('code:' + res.data.code);
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
    this.setData({
      fund: 28,
      pickGkpInfo: {},
      pickDefInfo: {},
      pickMidInfo: {},
      pickFwdInfo: {},
      pickCapInfo: {},
      // 垃圾双向绑定
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
      reason: ""

    });
  },

})