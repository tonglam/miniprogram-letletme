import {
  getFpldle
} from "../../../utils/request";
import moment from 'moment';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const defaultColour = "background-color:black",
  green = "background-color:#6aaa64",
  yellow = "background-color:#c9b458",
  gray = "background-color:#787c7e";

Page({

  data: {
    // 用户信息
    userInfo: {},
    // 显示
    registerShow: false,
    riddleShow: false,
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
    solve: false,
    // pop
    questionShow: false,
    giftShow: false,
    recordsShow: false,
    medalShow: false,
    actionShow: false,
    // action
    actions: [{
        name: '个人记录',
      },
      {
        name: '排行榜',
      },
      {
        name: '生成海报',
      },
    ],
    // picture
    // imgData: '',
  },

  /**
   * 原生
   */

  onShow: function () {
    let openId = wx.getStorageSync('openId');
    if (openId === '') {
      this.getOpenId();
    } else {
      this.setData({
        "userInfo.openId": openId
      });
      // userInfo
      this.initUserInfo();
    }
    this.setData({
      date: moment().format("MMDD")
    });
    this.initDailyFpldle();
    this.initDailyResult();
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
    this.insertDailyResult(inputList);
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
      let roundResult = resultList.toString(),
        tryTimes = this.data.tryTimes + 1;
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

  // 更多
  onMore() {
    this.setData({
      actionShow: true
    });
  },

  // 面板关闭
  onActionClose() {
    this.setData({
      actionShow: false
    });
  },

  // 面板选择
  onActionSelect(event) {
    console.log(event.detail);
  },

  // 记录
  onRecords() {
    this.setData({
      recordsShow: true
    });
  },

  // 记录关闭
  onRecordsClose() {
    this.setData({
      recordsShow: false
    });
  },

  // 排行榜
  onMedal() {
    this.setData({
      medalShow: true
    });
  },

  // 排行榜关闭
  onMedalClose() {
    this.setData({
      medalShow: false
    });
  },

  // register回填
  onRegister(event) {
    let data = event.detail;
    if (data === '') {
      return false;
    }
    let userInfo = this.data.userInfo;
    userInfo.nickname = data.nickname;
    userInfo.avatarUrl = data.avatarUrl;
    console.log("userInfo: " + userInfo);
    this.setData({
      registerShow: false,
      userInfo: userInfo
    });
    // 新增到后台
    this.insertUserInfo();
  },

  /**
   * 数据
   */

  // 获取每日谜底
  initDailyFpldle() {
    getFpldle('getDailyFpldle', {}, false)
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

  // 获取openId
  getOpenId() {
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          getFpldle('getWechatUserOpenId', {
              code: res.code
            }, false)
            .then(res => {
              let openId = res.data;
              that.setData({
                "userInfo.openId": openId
              });
              // userInfo
              this.initUserInfo();
            })
            .catch(res => {
              console.log('fail:', res);
            });
        }
      }
    })
    wx.setStorageSync('openId', this.data.userInfo.openId);
  },

  // 每日结果
  initDailyResult() {
    getFpldle('getDailyResult', {
        openId: this.data.userInfo.openId
      }, false)
      .then(res => {
        let list = res.data,
          tryTimes = list.length;
        this.setData({
          tryTimes: tryTimes,
          inputList: [],
          resultList: []
        });
        for (let i = 0; i < tryTimes; i++) {
          let group = String.fromCharCode(i + 65),
            letterList = list[i].split(","),
            resultList = [];
          for (let j = 0; j < 5; j++) {
            let column = String.fromCharCode(j + 65),
              position = group + column,
              letter = letterList[j],
              fpldleName = this.data.fpldleName,
              fpldleLetter = fpldleName[j],
              colourPosition = position + 'Style',
              colour = defaultColour,
              result = 0;;
            if (letter === fpldleLetter) { // correct
              colour = green;
              result = 2;
            } else if (fpldleName.indexOf(letter) != -1) { // order
              colour = yellow;
              result = 1;
            } else { // wrong
              colour = gray;
              result = 0;
            }
            resultList.push(result);
            this.setData({
              [colourPosition]: colour,
            });
            this.setData({
              [position]: letter
            });
            if (resultList.toString() === "2,2,2,2,2") { // 猜对了
              this.setData({
                solve: true
              });
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
            }
          }
        }
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 插结果
  insertDailyResult(inputList) {
    getFpldle('insertDailyResult', {
      openId: this.data.userInfo.openId,
      result: inputList.toString()
    }, false)
  },

  // 获取球员图片
  // initPlayerPicture() {
  //   getFpldle('getPlayerPicture', {
  //       code: this.data.fpldle.code
  //     }, false)
  //     .then(res => {
  //       let imgData = res.data.replace(/[\r\n]/g, '');
  //       this.setData({
  //         imgData: imgData
  //       });
  //       console.log(this.data.imgData);
  //     })
  //     .catch(res => {
  //       console.log('fail:', res);
  //     });
  // },

  // 获取用户信息
  initUserInfo() {
    getFpldle('getUserInfo', {
        openId: this.data.userInfo.openId
      }, false)
      .then(res => {
        let data = res.data;
        if (data === '') {
          this.setData({
            registerShow: true
          });
          return false;
        }
        this.setData({
          userInfo: data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 新增用户信息
  insertUserInfo() {
    getFpldle('insertUserInfo', {
      openId: this.data.userInfo.openId,
      nickName: this.data.userInfo.nickName,
      avatarUrl: this.data.userInfo.avatarUrl
    }, false);
  }

})