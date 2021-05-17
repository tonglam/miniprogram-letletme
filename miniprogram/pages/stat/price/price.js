import moment from 'moment';
import {
  get
} from '../../../utils/request';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const type = ['Rise', 'Faller', 'Start'];

Page({

  data: {
    // 数据
    riseInfoShow: false,
    fallerInfoShow: false,
    startInfoShow: false,
    riseList: [],
    fallerList: [],
    startList: [],
    // picker
    pickerShow: false,
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
    // refresh
    pullDownRefresh: false,
  },

  /**
   * 原生
   */

  onShow: function () {
    // 拉取当日身价
    this.getPirceList();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    // 拉取当日身价
    this.getPirceList();
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

  // 更换日期
  onClickDate() {
    this.setData({
      pickerShow: true
    });
  },

  // 关闭弹出层
  onPopClose() {
    this.setData({
      pickerShow: false
    });
  },

  // picker确认
  onPickerConfirm(event) {
    let date = moment(event.detail).format("YYYY-MM-DD");
    this.setData({
      pickerShow: false
    });
    if (date === this.data.date) {
      return false;
    }
    this.setData({
      date: date
    });
    this.getPirceList();
  },

  onPickerCancel() {
    this.setData({
      pickerShow: false
    });
  },

  /**
   * 数据
   */

  // 拉取球员身价
  getPirceList() {
    get('stat/qryPlayerValueByDate', {
      date: this.data.date
    })
      .then(res => {
        // 下拉刷新
        if (this.data.pullDownRefresh) {
          wx.stopPullDownRefresh({
            success: () => {
              Toast({
                type: 'success',
                duration: 600,
                message: "刷新成功"
              });
              this.setData({
                pullDownRefresh: false
              });
            },
          });
        }
        // 更新
        let result = res.data,
          riseInfoShow = false,
          fallerInfoShow = false,
          startInfoShow = false;
        if (JSON.stringify(result) === '{}') {
          this.setData({
            riseInfoShow: true,
            fallerInfoShow: true,
            startInfoShow: true
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

})