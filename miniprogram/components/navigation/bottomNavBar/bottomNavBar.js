const map = {
  "live": {
    "pages": [{
        name: "球队",
        subname: '查看球队实时得分',
      }, {
        name: "联赛",
        subname: '查看联赛实时得分和排名',
      }, {
        name: "淘汰赛",
        subname: '查看淘汰赛实时得分',
      }, {
        name: "比赛",
        subname: '查看实时更新的比赛结果',
      }
      // },{
      //   name: "冠军杯",
      //   subname: '查看实时更新的冠军杯结果',
      // }
    ],
    "url": {
      "球队": "/pages/live/entry/entry",
      "联赛": "/pages/live/tournament/tournament",
      "淘汰赛": "/pages/live/knockout/knockout",
      "比赛": "/pages/live/match/match",
      // "冠军杯":"/pages/live/championLeague/championLeague"
    },
    "show": true
  },
  "summary": {
    "pages": [{
        name: "比赛周",
        subname: '查看比赛周总体数据',
      }, {
        name: "球队",
        subname: '查看球队统计数据',
      },
      {
        name: "联赛",
        subname: '查看联赛统计数据',
      },
      // },
      // {
      //   name: "推荐阵容",
      //   subname: '查看各类推荐阵容'
      // },
      {
        name: "团战",
        subname: '浙江团战',
      }
    ],
    "url": {
      "比赛周": "/pages/summary/overall/overall",
      "球队": "/pages/summary/entry/entry",
      "联赛": "/pages/summary/league/league",
      // "推荐阵容": "/pages/summary/scout/scout",
      "团战": "/pages/summary/groupTournament/groupTournament"
    },
    "show": true
  },
  "stat": {
    "pages": [{
        name: "身价变化",
        subname: '查看每日价格涨跌',
      },
      {
        name: "阵容选择",
        subname: '查看联赛每轮阵容选择结果',
      },
      // {
      //   name: "赛程查看",
      //   subname: '查看所有赛程',
      // },
      {
        name: "球员数据",
        subname: '查看球员数据',
      },
      {
        name: "球队数据",
        subname: '查看球队数据',
      },
      {
        name: "筛选器",
        subname: '乱七八糟的数据查询',
      }
    ],
    "url": {
      "身价变化": "/pages/stat/price/price",
      "阵容选择": "/pages/stat/select/select",
      // "赛程查看": "/pages/stat/fixture/fixture",
      "球员数据": "/pages/stat/player/player",
      "球队数据": "/pages/stat/team/team",
      "筛选器": "/pages/stat/filter/filter"
    },
    "show": true
  },
  // "group": {
  //   "pages": [],
  //   "url": "/pages/group/scout/scout",
  //   "show": false
  // },
  "me": {
    "pages": [{
        name: "我的球队",
        subname: '查看我的球队数据',
      },
      {
        name: "我的联赛",
        subname: '查看我的联赛数据',
      },
      {
        name: "我的抽签",
        subname: "瑞士轮抽签"
      }
      // {
      //   name: "冠军杯",
      //   subname: '查看我的冠军杯结果',
      // }
    ],
    "url": {
      "我的球队": "/pages/me/entry/entry",
      "我的联赛": "/pages/me/tournament/tournament",
      "我的抽签": "/pages/me/draw/draw"
      // "冠军杯":"/pages/me/championLeague/championLeague",
    },
    "show": true
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