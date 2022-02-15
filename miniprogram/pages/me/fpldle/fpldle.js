import {
  get
} from "../../../utils/request";
import moment from 'moment';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

let defaultColour = "background-color:black",
  green = "background-color:#6aaa64",
  yellow = "background-color:#c9b458",
  gray = "background-color:#787c7e";

Page({

  data: {
    // 格子
    AA: "",
    AAStyle: defaultColour,
    AB: "",
    ABStyle: defaultColour,
    AC: "",
    ACStyle: defaultColour,
    AD: "",
    ADStyle: defaultColour,
    AE: "",
    AEStyle: defaultColour,
    BA: "",
    BAStyle: defaultColour,
    BB: "",
    BBStyle: defaultColour,
    BC: "",
    BCStyle: defaultColour,
    BD: "",
    BDStyle: defaultColour,
    BE: "",
    BEStyle: defaultColour,
    CA: "",
    CAStyle: defaultColour,
    CB: "",
    CBStyle: defaultColour,
    CC: "",
    CCStyle: defaultColour,
    CD: "",
    CDStyle: defaultColour,
    CE: "",
    CEStyle: defaultColour,
    DA: "",
    DAStyle: defaultColour,
    DB: "",
    DBStyle: defaultColour,
    DC: "",
    DCStyle: defaultColour,
    DD: "",
    DDStyle: defaultColour,
    DE: "",
    DEStyle: defaultColour,
    EA: "",
    EAStyle: defaultColour,
    EB: "",
    EBStyle: defaultColour,
    EC: "",
    ECStyle: defaultColour,
    ED: "",
    EDStyle: defaultColour,
    EE: "",
    EEStyle: defaultColour,
    FA: "",
    FAStyle: defaultColour,
    FB: "",
    FBStyle: defaultColour,
    FC: "",
    FCStyle: defaultColour,
    FD: "",
    FDStyle: defaultColour,
    FE: "",
    FEStyle: defaultColour,
    // 公共数据
    date: "",
    fpldle: {},
    fpldleName: "",
    fpldleNameList: [],
    tryTimes: 0,
    total: 6,
    inputList: [],
    resultList: [],
    dailyResultList: [],
    solve: false,
    openId: '',
    // pop
    questionShow: false,
    searchShow: false,
    giftShow: false,
    recordsShow: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    this.getOpenId();
    this.setData({
      date: moment().format("YYYYMMDD")
    });
    this.initDailyFpldle();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // 模拟键盘输入
  input(event) {
    this.inputLetter(event.target.id)
  },

  // 将键盘输入传到格子
  inputLetter(letter) {
    if (this.data.solve) {
      return false;
    }
    let tryTimes = this.data.tryTimes;
    if (tryTimes === 6) {
      return false;
    }
    let group = String.fromCharCode(tryTimes + 65),
      inputList = this.data.inputList,
      inputSize = inputList.length,
      column = String.fromCharCode(inputSize + 65),
      position = group + column;
    if (inputList.length === 5) {
      return false;
    }
    inputList.push(letter);
    this.setData({
      [position]: letter,
    });
  },

  // 点确认时触发验证
  inputEnter() {
    if (this.data.solve) {
      return false;
    }
    let tryTimes = this.data.tryTimes;
    if (tryTimes === 6) {
      Toast('很遗憾，明天再来');
      return false;
    }
    let group = String.fromCharCode(tryTimes + 65),
      inputList = this.data.inputList,
      inputSize = inputList.length,
      resultList = this.data.resultList,
      resultSize = resultList.length,
      fpldleName = this.data.fpldleName;
    if (resultSize === 5) {
      return false;
    }
    if (inputSize !== 5) {
      return false;
    }
    this.setData({
      inputList: []
    });
    for (let index = 0; index < inputList.length; index++) {
      let letter = inputList[index],
        fpldleLetter = fpldleName[index],
        column = String.fromCharCode(index + 65),
        position = group + column,
        colourPosition = position + 'Style',
        color = defaultColour,
        result = 0;
      if (letter === fpldleLetter) { // correct
        color = green;
        result = 2;
      } else if (fpldleName.indexOf(letter) != -1) { // order
        color = yellow;
        result = 1;
      } else { // wrong
        color = gray;
        result = 0;
      }
      this.setData({
        [colourPosition]: color,
      });
      resultList.push(result);
    }
    if (resultList.length == 5) {
      let dailyResultList = this.data.dailyResultList,
        roundResult = resultList.toString(),
        tryTimes = this.data.tryTimes + 1;
      dailyResultList.push(roundResult);
      this.setData({
        tryTimes: tryTimes,
        resultList: [],
      });
      if (roundResult === "2,2,2,2,2") { // 猜对了
        this.setData({
          solve: true
        });
        Toast('恭喜，今日答案: ' + this.data.fpldle.fullName);
        // 清空答案
        for (let groupIndex = 0; groupIndex < 6; groupIndex++) {
          let group = String.fromCharCode(groupIndex + 65);
          for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
            let column = String.fromCharCode(columnIndex + 65),
              position = group + column;
            this.setData({
              [position]: ""
            });
          }
        }
        return false;
      }
      if (tryTimes === 6) {
        Toast('很遗憾，明天再来');
        for (let groupIndex = 0; groupIndex < 6; groupIndex++) {
          let group = String.fromCharCode(groupIndex + 65);
          for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
            let column = String.fromCharCode(columnIndex + 65),
              position = group + column;
            this.setData({
              [position]: ""
            });
          }
        }
        return false;
      }
    }
  },

  // 退格
  inputBack() {
    let tryTimes = this.data.tryTimes,
      group = String.fromCharCode(tryTimes + 65),
      inputList = this.data.inputList,
      inputSize = inputList.length,
      column = String.fromCharCode(inputSize - 1 + 65),
      position = group + column;
    if (inputSize === 0) {
      return false;
    }
    inputList.pop();
    this.setData({
      [position]: '',
      inputList: inputList
    });
  },

  // 规则展示
  onQuestion() {
    this.setData({
      questionShow: true
    });
  },

  // 规则展示关闭
  onQuestionClose() {
    this.setData({
      questionShow: false
    });
  },

  // 搜索
  onSearch() {
    this.setData({
      searchShow: true
    });
  },

  // 搜索关闭
  onSearchClose() {
    this.setData({
      searchShow: false
    });
  },

  // 提示
  onGift() {
    this.setData({
      giftShow: true
    });
  },

  // 提示关闭
  onGiftClose() {
    this.setData({
      giftShow: false
    });
  },

  // 统计
  onRecords() {
    this.setData({
      recordsShow: true
    });
  },

  // 统计关闭
  onRecordsClose() {
    this.setData({
      recordsShow: false
    });
  },

  /**
   * 数据
   */
  initDailyFpldle() {
    get('fpldle/getDailyFpldle', {
        date: this.data.date
      })
      .then(res => {
        let data = res.data;
        this.setData({
          fpldle: data,
          fpldleName: data.name
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  getOpenId() {
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          get('fpldle/getWechatUserOpenId', {
              openId: res.code
            })
            .then(res => {
              that.setData({
                openId: res.data
              });
            })
            .catch(res => {
              console.log('fail:', res);
            });
        }
      }
    })
  },



})