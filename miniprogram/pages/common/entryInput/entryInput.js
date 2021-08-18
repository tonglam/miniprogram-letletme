import {
  delay
} from '../../../utils/utils';
import {
  post
} from '../../../utils/request';

const app = getApp();

Page({
  data: {
    // 数据
    entry: "",
    entryName: "",
    playerName: "",
    errorMsg: "",
    fuzzyEntryList: [],
    // picker
    popShow: false,
    pickerShow: false,
    entryMap: {},
    columns: [],
  },

  /**
   * 原生
   */

  onShow: function () {
    delay(800).then(() => {
      console.log('entryInput:' + app.globalData.entry);
      if (app.globalData.entry > 0) {
        this.redirectHome();
      }
    });
  },

  /**
   * 操作
   */

  // 忘记id
  onClickForget() {
    this.setData({
      popShow: true
    });
  },

  // 输入确认
  onClickInput() {
    if (!this.checkEntry(this.data.entry)) {
      return false;
    }
    this.saveEntry();
  },

  // 关闭弹出层
  onPopClose() {
    this.setData({
      popShow: false
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

  // picker确认
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

  // picker取消
  onPickerCancel() {
    this.setData({
      pickerShow: false,
      popShow: true,
      entryName: "",
      playerName: ""
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

  /**
   * 数据
   */

  // 校验team_id
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

  // 保存team_id
  saveEntry() {
    app.changeEntry(this.data.entry)
    // 跳转首页
    this.redirectHome();
  },

  // 跳转
  redirectHome() {
    wx.redirectTo({
      url: '../home/home'
    });
  },

  // 模糊查询
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

})