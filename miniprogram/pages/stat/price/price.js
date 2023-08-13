import moment from 'moment';
import {
  get
} from '../../../utils/request';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp(),
  type = ['Rise', 'Faller', 'Start'];

Page({

  data: {
    // 公共
    mode: '模式-日期',
    modeTitle: '',
    season: '',
    // 日期数据
    riseInfoShow: false,
    fallerInfoShow: false,
    startInfoShow: false,
    riseList: [],
    fallerList: [],
    startList: [],
    // 球员数据
    playerInfo: {},
    playerValueList: {},
    // picker
    modePickerShow: false,
    datePickerShow: false,
    playerPickerShow: false,
    date: moment().format("YYYY-MM-DD"),
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return `${value}日`;
    },
    modes: ['模式-日期', '模式-球员'],
    // refresh
    pullDownRefresh: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      season: app.globalData.season
    });
    // 拉取身价
    if (this.data.riseList.length === 0 && this.data.fallerList.length === 0 && this.data.startList.length === 0) {
      this.getPirceList();
    }
    // 默认日期模式
    if (this.data.mode === '模式-日期') {
      this.setData({
        modeTitle: this.data.date
      });
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 刷新身价
    this.refreshPlayerValue();
  },

  onShareAppMessage: function () {
    return {
      title: '身价变化(' + this.data.date + ')',
      desc: "",
      path: '',
      imageUrl: '****.png'
    }
  },

  /**
   * 操作
   */

  // 模式内容
  onClickMode() {
    this.setData({
      modePickerShow: true
    });
  },

  onClickModeDetail() {
    if (this.data.mode === '模式-日期') {
      this.setData({
        datePickerShow: true
      });
    } else if (this.data.mode === '模式-球员') {
      this.setData({
        playerPickerShow: true
      });
    }
  },

  // 关闭弹出层
  onModePopClose() {
    this.setData({
      modePickerShow: false
    });
  },

  onDatePopClose() {
    this.setData({
      datePickerShow: false
    });
  },

  onPlayerPopClose() {
    this.setData({
      playerPickerShow: false
    });
  },

  // 标签选择
  onTabsClick(event) {
    wx.showToast({
      title: `点击标签 ${event.detail.name}`,
      icon: 'none',
    });
  },

  // picker确认
  onModePickerConfirm(event) {
    let mode = event.detail.value;
    this.setData({
      modePickerShow: false,
      mode: mode,
      pullDownRefresh: false
    });
    if (mode === '模式-日期') {
      this.setData({
        playerPickerShow: false,
        modeTitle: this.data.date,
      });
    } else if (mode === '模式-球员') {
      this.setData({
        playerPickerShow: true,
        modeTitle: '',
      });
    }
  },

  onDatePickerConfirm(event) {
    let date = moment(event.detail).format("YYYY-MM-DD");
    this.setData({
      datePickerShow: false,
      mode: '模式-日期'
    });
    if (date === this.data.date) {
      return false;
    }
    this.setData({
      date: date,
      modeTitle: date
    });
    this.getPirceList();
  },

  // picker取消
  onModePickerCancel() {
    this.setData({
      modePickerShow: false
    });
  },

  onDatePickerCancel() {
    this.setData({
      datePickerShow: false
    });
  },

  // picker回调
  onPlayerPickResult(event) {
    this.setData({
      playerPickerShow: false
    });
    let playerInfo = event.detail;
    if (playerInfo === '' || playerInfo === null) {
      return false;
    }
    this.setData({
      playerInfo: playerInfo,
      modeTitle: playerInfo.webName
    });
    this.getPirceList();
  },

  // cell 点击
  onClickTeamElement(event) {
    let element = event.target.id,
      playerInfo = {
        element: element,
        webName: this.data.teamWebNameMap[element]
      };
    this.setData({
      mode: '模式-球员',
      playerInfo: playerInfo,
      modeTitle: playerInfo.webName
    });
    this.getPirceList();
  },

  /**
   * 数据
   */

  // 拉取球员身价
  getPirceList() {
    let mode = this.data.mode;
    if (mode === '模式-日期') {
      this.getPirceListByDate();
    } else if (mode === '模式-球员') {
      this.getPirceListByElement();
    }
  },

  getPirceListByDate() {
    get('stat/qryPlayerValueByDate', {
        date: this.data.date
      })
      .then(res => {
        let result = res.data,
          riseInfoShow = false,
          fallerInfoShow = false,
          startInfoShow = false;
        if (JSON.stringify(result) === '{}') {
          this.setData({
            riseInfoShow: true,
            fallerInfoShow: true,
            startInfoShow: true,
            riseList: [],
            fallerList: [],
            startList: []
          });
          return false;
        }
        let riseList = result[type[0]],
          fallerList = result[type[1]],
          startList = result[type[2]];
        // rise
        if (riseList.length === 0) {
          riseInfoShow = true;
        }
        // faller
        if (fallerList.length === 0) {
          fallerInfoShow = true;
        }
        // start
        if (startList.length === 0) {
          startInfoShow = true;
        }
        this.setData({
          refreshDone: true,
          riseList: riseList,
          fallerList: fallerList,
          startList: startList,
          riseInfoShow: riseInfoShow,
          fallerInfoShow: fallerInfoShow,
          startInfoShow: startInfoShow
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  getPirceListByElement() {
    let element = this.data.playerInfo.element;
    if (element <= 0) {
      return false;
    }
    get('stat/qryPlayerValueByElement', {
        element: element
      })
      .then(res => {
        this.setData({
          refreshDone: true,
          playerValueList: res.data
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 刷新身价
  refreshPlayerValue() {
    get('stat/refreshPlayerValue')
      .then(() => {
        // 下拉刷新
        if (this.data.pullDownRefresh) {
          wx.stopPullDownRefresh({
            success: () => {
              Toast({
                type: 'success',
                duration: 1000,
                message: "刷新成功"
              });
              this.setData({
                pullDownRefresh: false
              });
            },
          });
        }
        // 更新
        this.getPirceList();
      })
  }

})