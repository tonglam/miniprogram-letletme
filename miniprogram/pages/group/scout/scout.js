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
  },

  // 拉取球探信息
  initScout() {
    get('group/qryScoutEntry')
      .then(res => {
        // let entry = app.globalData.entryInfoData.entry;
        let entry = 1870;
        if (Object.keys(res.data).indexOf(entry + '') === 0) {
          let scoutEntry = {
            entry: entry,
            name: res.data[entry]
          };
          this.setData({
            scoutEntry: scoutEntry
          });
        }
      })
      .catch(res => {
        console.log('fail:', res);
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
    let fund = this.calcLeftFund(elementType, price);
    if (!this.checkAvailable(webName, elementType, fund)) {
      return false;
    }
    // 设置
    switch (elementType) {
      case '1':
        this.setData({
          pickGkpInfo: entryInfo,
          pickGkpPrice: price,
          pickGkp: webName + "  " + "£" + price + "m",
          fund: fund
        });
        break;
      case '2':
        this.setData({
          pickDefInfo: entryInfo,
          pickDefPrice: price,
          pickDef: webName + "  " + "£" + price + "m",
          fund: fund
        });
        break;
      case '3':
        this.setData({
          pickMidInfo: entryInfo,
          pickMidPrice: price,
          pickMid: webName + "  " + "£" + price + "m",
          fund: fund
        });
        break;
      case '4':
        this.setData({
          pickFwdInfo: entryInfo,
          pickFwdPrice: price,
          pickFwd: webName + "  " + "£" + price + "m",
          fund: fund
        });
        break;
      case '5':
        this.setData({
          pickCapInfo: entryInfo,
          pickCapPrice: price,
          pickCap: webName + "  " + "£" + price + "m"
        });
        break;
      default:
        console.log('method: onPickResult, something wrong');
    }
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
  calcLeftFund(elementType, price) {
    let fund = this.data.fund,
      oldPrice = 0;
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
    post('group/upsertEventScout', {
        scoutData: scoutData
      })
      .then(res => {
        Toast.success('提交成功');
      })
      .catch(res => {
        console.log('fail:', res);
      });
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