App({
  onLaunch: function () {
      wx.cloud.init({
        env: 'cloud1',
        traceUser: true,
    });
    this.globalData = {};
  }
})
