const app = getApp();

import {
  diffDeadlineTime
} from '../../../utils/utils';

Page({

  data: {
    time: 0,
    nextGw: 0,
    deadline: "",
    timeData: {},
  },

  onLoad: function () {
    let nextGw = app.globalData.nextGw,
      deadline = app.globalData.deadline,
      time = diffDeadlineTime(app.globalData.utcDeadline);
    this.setData({
      nextGw: nextGw,
      deadline: deadline,
      time: time
    });
  },

  onChange(event) {
    this.setData({
      timeData: event.detail,
    });
  },

});