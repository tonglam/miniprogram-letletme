const urlMap = {
  "home": "../index/index",
  "live": "../live/entry/entry",
  "group": "../group/scout/scout",
  "me": "../me/me"
}

Component({

  properties: {
    active: String
  },

  data: {
    active: '',
  },

  methods: {
    onChange(event) {
      let name = event.detail;
      this.setData({
        active: name
      });
      let url = urlMap[name];
      wx.navigateTo({
        url: url
      });
    },
  }
})