const app = getApp();

Page({

  data: {
    time: 30 * 60 * 60 * 1000,
    nextGw: "",
    deadline: "",
    timeData: {},
  },

  onLoad: function () {
  },

  onChange(event) {
    this.setData({
      timeData: event.detail,
    });
  },

});