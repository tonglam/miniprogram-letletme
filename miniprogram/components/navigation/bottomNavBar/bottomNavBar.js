const map = {
  "tournament": {
    "pages": [{
      name: "首页"
    }],
    "url": {
      "首页": "../../../pages/common/home/home",
    },
    "show": true
  },
  "live": {
    "pages": [{
      name: "我的球队"
    }, {
      name: "小联赛"
    }, {
      name: "比赛"
    }],
    "url": {
      "我的球队": "../../../pages/live/entry/entry",
      "小联赛": "../../../pages/live/tournament/tournament",
      "比赛": "../../../pages/live/match/match"
    },
    "show": true
  },
  "stat": {
    "pages": [{
      name: "身价变化"
    }],
    "url": {
      "身价变化": "../../../pages/stat/price/price"
    },
    "show": true
  },
  "group": {
    "pages": [],
    "url": "../../../pages/group/scout/scout",
    "show": false
  },
  "me": {
    "pages": [],
    "url": "../../../pages/me/info/info",
    "show": false
  }
}

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