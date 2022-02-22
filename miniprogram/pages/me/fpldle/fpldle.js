import {
  getFpldle
} from "../../../utils/request";
import moment from 'moment';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const defaultColour = "background-color:black",
  green = "background-color:#6aaa64",
  yellow = "background-color:#c9b458",
  gray = "background-color:#787c7e",
  roundLength = 5,
  maxTryTimes = 6;

Page({

  data: {
    // 用户信息
    hasUserInfo: true,
    openId: '',
    nickName: '',
    avatarUrl: '',
    // 公共数据
    date: "",
    fpldle: {},
    fpldleNameList: [],
    tryTimes: 0,
    total: maxTryTimes,
    inputList: [],
    verifyList: [],
    resultList: [],
    solve: false,
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
    // pop
    questionShow: false,
    hideShow: true,
    recordShow: false,
    rankShow: false,
    actionShow: false,
    // action
    actions: [{
        name: '往期答案',
      }, {
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
    // 拿用户信息
    let nickName = wx.getStorageSync('nickName'),
      avatarUrl = wx.getStorageSync('avatarUrl');
    if (nickName === '' || nickName === 'undefined' || avatarUrl === '' || avatarUrl === 'undefined') {
      this.setData({
        hasUserInfo: false
      });
    } else {
      this.setData({
        hasUserInfo: true,
        nickName: nickName,
        avatarUrl: avatarUrl
      });
    }
    // 拿谜底
    this.initDailyFpldle();
    // 拿openId和当日结果
    let openId = wx.getStorageSync('openId');
    if (openId === '' || openId === 'undefined') {
      this.getOpenId();
    } else {
      this.setData({
        openId: openId
      });
      // daily result
      this.initDailyResult();
    }
    // 其他数据
    this.setData({
      date: moment().format("MMDD")
    });
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
    if (tryTimes === maxTryTimes) {
      return false;
    }
    let group = String.fromCharCode(tryTimes + 65),
      inputList = this.data.inputList,
      inputSize = inputList.length,
      column = String.fromCharCode(inputSize + 65),
      position = group + column;
    if (inputList.length === roundLength) {
      return false;
    }
    // 显示输入的字母
    inputList.push(letter);
    this.setData({
      [position]: letter,
    });
  },

  // 点确认时触发验证
  inputEnter() {
    // 已猜出
    if (this.data.solve) {
      return false;
    }
    // 机会用完
    let tryTimes = this.data.tryTimes;
    if (tryTimes === maxTryTimes) {
      Toast('很遗憾，明天再来');
      return false;
    }
    let group = String.fromCharCode(tryTimes + 65),
      inputList = this.data.inputList,
      inputSize = inputList.length;
    if (inputSize !== roundLength) {
      return false;
    }
    // 验证
    this.verifyLetter(group);
    // 清空输入列表
    this.setData({
      tryTimes: tryTimes + 1,
      inputList: [],
      verifyList: [],
    });
    // 插每日结果
    this.insertDailyResult(inputList);
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

  // 显示字母
  onEye() {
    let hideShow = !this.data.hideShow;
    this.setData({
      hideShow: hideShow
    });
    if (hideShow) {
      this.showLetter();
    } else {
      this.hideLetter();
    }
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
  onRecord() {
    this.setData({
      recordShow: true
    });
  },

  // 记录关闭
  onRecordClose() {
    this.setData({
      recordShow: false
    });
  },

  // 排行榜
  onRank() {
    this.setData({
      rankShow: true
    });
  },

  // 排行榜关闭
  onRankClose() {
    this.setData({
      rankShow: false
    });
  },

  // 显示字母
  showLetter() {
    let dailyResultList = this.data.resultList,
      tryTimes = dailyResultList.length;
    for (let i = 0; i < tryTimes; i++) {
      let group = String.fromCharCode(i + 65),
        letterList = dailyResultList[i].split(","),
        resultList = [];
      for (let j = 0; j < roundLength; j++) {
        let column = String.fromCharCode(j + 65),
          position = group + column,
          letter = letterList[j],
          fpldleName = this.data.fpldle.name,
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
      }
    }
  },

  // 隐藏字母
  hideLetter() {
    for (let i = 0; i < maxTryTimes; i++) {
      let group = String.fromCharCode(i + 65);
      for (let j = 0; j < roundLength; j++) {
        let column = String.fromCharCode(j + 65),
          position = group + column;
        this.setData({
          [position]: ''
        });
      }
    }
  },

  // 验证字母
  verifyLetter(group) {
    let fpldleName = this.data.fpldle.name,
      tryTimes = this.data.tryTimes + 1,
      inputList = this.data.inputList,
      verifyList = this.data.verifyList,
      resultList = this.data.resultList,
      roundResultList = [];
    for (let index = 0; index < roundLength; index++) {
      let letter = inputList[index],
        fpldleLetter = fpldleName[index],
        column = String.fromCharCode(index + 65),
        position = group + column,
        colourPosition = position + 'Style',
        color = defaultColour,
        verify = 0;
      // add letter
      roundResultList.push(letter);
      // colour
      if (letter === fpldleLetter) { // correct
        color = green;
        verify = 2;
      } else if (fpldleName.indexOf(letter) != -1) { // order
        color = yellow;
        verify = 1;
      } else { // wrong
        color = gray;
        verify = 0;
      }
      verifyList.push(verify);
      this.setData({
        [colourPosition]: color,
      });
    }
    let verifyResult = verifyList.toString(),
      roundResult = roundResultList.toString();
    // 猜对了
    if (verifyResult === "2,2,2,2,2") {
      this.setData({
        solve: true
      });
      Toast('恭喜，今日答案: ' + this.data.fpldle.fullName);
    }
    resultList.push(roundResult);
    // 全错
    if (tryTimes === maxTryTimes && verifyResult !== "2,2,2,2,2") {
      Toast('很遗憾，明天再来');
    }
  },

  /**
   * 数据
   */

  // 获取每日谜底
  initDailyFpldle() {
    getFpldle('getDailyFpldle', {}, false)
      .then(res => {
        this.setData({
          fpldle: res.data
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
                openId: openId
              });
              // 缓存
              wx.setStorageSync('openId', openId);
              // daily result
              that.initDailyResult();
            })
            .catch(res => {
              console.log('fail:', res);
            });
        }
      }
    })
  },

  // 每日结果
  initDailyResult() {
    getFpldle('getDailyResult', {
        openId: this.data.openId
      }, false)
      .then(res => {
        let list = res.data,
          tryTimes = list.length;
        this.setData({
          tryTimes: tryTimes,
          inputList: [],
          resultList: list
        });
        // 显示结果
        this.showLetter();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 插结果
  insertDailyResult(inputList) {
    getFpldle('insertDailyResult', {
        openId: this.data.openId,
        result: inputList.toString()
      }, false)
      .catch(res => {
        console.log('fail:', res);
      });
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

  // 新增用户信息
  insertUserInfo() {
    getFpldle('insertUserInfo', {
        openId: this.data.openId,
        nickName: this.data.nickName,
        avatarUrl: this.data.avatarUrl
      }, false)
      .catch(res => {
        console.log('fail:', res);
      });
  },

  /**
   * 微信能力
   */

  wxGetUserProfile() {
    wx.getUserProfile({
      desc: '用于展示头像和昵称信息',
      success: (res) => {
        let nickName = res.userInfo.nickName,
          avatarUrl = res.userInfo.avatarUrl;
        this.setData({
          nickName: nickName,
          avatarUrl: avatarUrl,
          hasUserInfo: true
        })
        // 缓存
        wx.setStorageSync('nickName', nickName);
        wx.setStorageSync('avatarUrl', avatarUrl);
        // 新增到后台
        this.insertUserInfo();
      },
      fail: (res) => {
        console.log('fail:', res)
      }
    })
  },

})