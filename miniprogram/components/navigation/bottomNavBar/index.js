const urlMap = {
  "tournament": "../../../pages/common/home/index",
  "live": "../../../pages/live/match/index",
  "report": "../../../pages/report/price/index",
  "group": "../../../pages/group/scout/index",
  "me": "../../../pages/me/info/index"
}

Component({

  properties: {
    active: String
  },

  data: {

  },

  methods: {
    onChange(event) {
      let name = event.detail;
      this.properties.active = name;
      let url = urlMap[name];
      wx.redirectTo({
        url: url
      });
    },
  }
})