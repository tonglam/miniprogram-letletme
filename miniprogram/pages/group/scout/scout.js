const app = getApp();

import { get, post } from '../../../utils/request'

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
    pickGkp: "",
    pickDef: "",
    pickMid: "",
    pickFwd: "",
    pickCap: "",
    scoutData: {}
  },

  onLoad() {
    this.initScout();
  },

  // 拉取球探信息
  initScout() {
    get('group/qryScoutEntry')
      .then(res => {
        // let entry = app.globalData.entry;
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
    switch (this.data.elementType) {
      case '1':
        this.setData({
          pickGkp: event.detail.webName,
          pickGkpInfo: event.detail
        });
        break;
      case '2':
        this.setData({
          pickDef: event.detail.webName,
          pickDefInfo: event.detail
        });
        break;
      case '3':
        this.setData({
          pickMid: event.detail.webName,
          pickMidInfo: event.detail
        });
        break;
      case '4':
        this.setData({
          pickFwd: event.detail.webName,
          pickFwdInfo: event.detail
        });
        break;
      case '5':
        this.setData({
          pickCap: event.detail.webName,
          pickCapInfo: event.detail
        });
        break;
      default:
        console.log('method: onPickResult, something wrong');
    }
  },

  // 资金计算
  calcLeftFund() {

  },

  // 提交
  onClickRefresh() {
    post('group/qryScoutEntry',{scoutData,scoutData})
    .then(res=>{

    })
    .catch(res => {
      console.log('fail:', res);
    });
  },

  // 重新选择
  onClickConfirm() {
    this.onLoad();
  },

})