import {
  diffDeadlineTime
} from '../../../utils/utils';

const app = getApp();

Page({

  data: {
    // 数据
    time: 0,
    nextGw: 0,
    deadline: "",
    timeData: {},
  },

  /**
   * 原生
   */

  onShow: function () {
    // 设置
    let nextGw = app.globalData.nextGw,
      deadline = app.globalData.deadline,
      time = diffDeadlineTime(app.globalData.utcDeadline);
    this.setData({
      nextGw: nextGw,
      deadline: deadline,
      time: time
    });
  },

  /**
   * 操作
   */

  // 倒计时变化
  onChange(event) {
    this.setData({
      timeData: event.detail,
    });
  },

});