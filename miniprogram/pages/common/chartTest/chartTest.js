Page({

  data: {

  },

  onShow: function () {
    let  list = [
      {
        value: 146,
        name: '门将'
      },
      {
        value: 538,
        name: '后卫'
      },
      {
        value: 938,
        name: '中场'
      },
      {
        value: 399,
        name: '前锋'
      }
    ];
    this.selectComponent('#scoreChart').setData({
      scoreList: list
    });
  },

})