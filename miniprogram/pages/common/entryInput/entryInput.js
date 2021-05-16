const app = getApp();

import {
  post
} from '../../../utils/request';

Page({
  data: {
    entry: "",
    entryName: "",
    playerName: "",
    errorMsg: "",
    fuzzyEntryList: [],
    popShow: false,
    pickerShow: false,
    entryMap: {},
    columns: [],
  },

  onShow: function () {
    if (app.globalData.entryInfoData.entry > 0) {
      this.redirect();
    }
  },

  // forget
  onClickForget() {
    this.setData({
      popShow: true
    });
  },

  // pop
  onPopClose() {
    this.setData({
      popShow: false
    });
  },

  // 模糊查询
  onClickQuery() {
    this.fuzzyQueryEntry();
    this.setData({
      popShow: false,
      pickerShow: true
    });
  },

  fuzzyQueryEntry() {
    let entryName = this.data.entryName,
      playerName = this.data.playerName;
    if (entryName === '' && playerName === '') {
      return false;
    }
    let param = {
      entryName: entryName,
      playerName: playerName
    };
    post('entry/fuzzyQueryEntry', param)
      .then(res => {
        this.initPickerColumns(res.data);
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 初始化选择器
  initPickerColumns(list) {
    let entryMap = {};
    let entryNameList = [];
    list.forEach(data => {
      entryNameList.push(data.entryName);
      entryMap[data.entryName] = data.entry;
    });
    this.setData({
      entryMap: entryMap,
      columns: entryNameList
    });
  },

  // picker
  onPickerConfirm(event) {
    const {
      value
    } = event.detail;
    this.setData({
      entry: this.data.entryMap[value],
      errorMsg: '',
      pickerShow: false
    });
  },

  onPickerCancel() {
    this.setData({
      pickerShow: false,
      popShow: true,
      entryName: "",
      playerName: ""
    });
  },

  // entry_input
  onClickInput() {
    if (!this.checkEntry(this.data.entry)) {
      return false;
    }
    this.saveEntry();
  },

  checkEntry() {
    if (!new RegExp("^[1-9]\\d*$").test(this.data.entry)) {
      this.setData({
        errorMsg: 'team_id需为正整数'
      });
      return false;
    } else {
      this.setData({
        errorMsg: ''
      });
      return true;
    }
  },

  saveEntry() {
    app.changeEntry(this.data.entry)
    // 跳转首页
    this.redirect();
  },

  redirect() {
    wx.redirectTo({
      url: '../home/home'
    });
  },

})