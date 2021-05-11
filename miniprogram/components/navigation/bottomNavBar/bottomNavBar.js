const urlMap = {
  "home": "../../../pages/common/index/index",
  "live": "../../../pages/live/entry/entry",
  "group": "../../../pages/group/scout/scout",
  "me": "../../../pages/common/me/me"
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
      wx.navigateTo({
        url: url
      });
    },
  }
})