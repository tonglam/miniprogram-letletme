const map = {
  "live": {
    "pages": [{
      name: "球队",
      subname: '查看球队实时得分',
    }, {
      name: "联赛",
      subname: '查看联赛实时得分和排名',
    }, {
      name: "比赛",
      subname: '查看实时更新的比赛结果',
    }],
    "url": {
      "球队": "/pages/live/entry/entry",
      "联赛": "/pages/live/tournament/tournament",
      "比赛": "/pages/live/match/match"
    },
    "show": true
  },
  "summary": {
    "pages": [
      {
      name: "球队",
      subname: '查看球队统计数据'
    },
    {
      name: "联赛",
      subname: '查看联赛统计数据',
    }
  ],
    "url": {
      "球队": "/pages/summary/entry/entry",
      "联赛": "/pages/summary/tournament/tournament",
    },
    "show": true
  },
  "stat": {
    "pages": [
      {
      name: "身价变化",
      subname: '查看每日价格涨跌',
    },
    {
      name: "阵容选择",
      subname: '查看联赛每轮阵容选择结果'
    }
  ],
    "url": {
      "身价变化": "/pages/stat/price/price",
      "阵容选择": "/pages/tournament/select/select"
    },
    "show": true
  },
  "group": {
    "pages": [],
    "url": "/pages/group/scout/scout",
    "show": false
  },
  "me": {
    "pages": [],
    "url": "/pages/me/info/info",
    "show": false
  }
};

Component({

  properties: {
    active: String
  },

  data: {
    show: false,
    actions: [],
    navName: ""
  },

  methods: {

    onChange(event) {
      let navName = event.detail,
        show = map[navName]["show"];
      this.properties.active = navName;
      this.setData({
        show: show,
        navName: navName,
        actions: map[navName]["pages"]
      });
      if (!show) {
        let url = map[navName]["url"];
        wx.redirectTo({
          url: url
        })
      }
    },

    onClose() {
      this.setData({
        show: false
      });
    },

    onSelect(event) {
      let url = map[this.data.navName]["url"][event.detail.name];
      wx.redirectTo({
        url: url
      });
    },

  }
})