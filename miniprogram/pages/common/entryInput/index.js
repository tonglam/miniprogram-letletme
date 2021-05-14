const app = getApp();

import {
  get,
  post
} from '../../../utils/request';
import {
  showOverallRank
} from '../../../utils/utils';

Page({
  data: {
    entry: "",
    entryName: "",
    playerName: "",
    errorMsg: "",
    userInfo: {},
    fuzzyEntryList: [],
    popShow: false,
    pickerShow: false,
    entryMap: {},
    columns: [],
  },

  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    });
    if (this.data.userInfo.entry > 0) {
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
    let entry = this.data.entry;
    app.globalData.entryInfoData.entry = entry;
    get('entry/qryEntryInfo', {
        entry: entry
      })
      .then(res => {
        let entryInfoData = res.data;
        this.setData({
          entry: entryInfoData.entry
        });
        entryInfoData['overallRank'] = showOverallRank(entryInfoData.overallRank);
        app.globalData.entryInfoData = entryInfoData;
      })
      .catch(res => {
        console.log('fail:', res);
      });
    this.redirect();
  },

  redirect() {
    wx.redirectTo({
      url: '../../common/home/index'
    });
  }

})