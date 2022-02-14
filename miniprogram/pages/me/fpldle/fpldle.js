import {
  get
} from "../../../utils/request";
import moment, {
  RFC_2822
} from 'moment';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

let defaultColour = "background-color:black",
  green = "background-color:#6aaa64",
  yellow = "background-color:#c9b458",
  gray = "background-color:#787c7e";

Page({

  data: {
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
  },

  /**
   * 原生
   */

  onShow: function () {
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
    console.log("letter: " + letter);
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
      resultList = this.data.resultList,
      resultSize = resultList.length,
      fpldleName = this.data.fpldleName;
    if (resultSize === 5) {
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
      console.log(roundResult);
      dailyResultList.push(roundResult);
      this.setData({
        tryTimes: tryTimes,
        resultList: [],
      });
      if (tryTimes === 6) {
        Toast('很遗憾，明天再来');
      }
      if (roundResult === "2,2,2,2,2") {
        this.setData({
          solve: true
        });
        Toast('恭喜，今日答案: MINGS');
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
    console.log("question");
  },

  // 统计
  onRecords() {
    console.log("records");
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

})