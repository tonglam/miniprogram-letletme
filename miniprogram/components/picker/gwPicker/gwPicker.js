const app = getApp();

Component({

  properties: {
    gw: Number,
    show: Boolean,
    full: Boolean
  },

  data: {
    current: 0,
    event: 'pickGw',
    gwMap: {},
    columns: [],
  },

  lifetimes: {
    attached: function () {
      this.setData({
        current: app.globalData.gw
      });
      this.initGwList();
    }
  },

  methods: {

    onClose() {
      this.triggerEvent(this.data.event, '');
    },

    onChange(event) {
      const {
        value
      } = event.detail;
      this.setData({
        gw: this.data.gwMap[value]
      });
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.gw);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

    initGwList() {
      let list = [],
        map = {};
      if (this.properties.full) {
        for (let i = 1; i <= 38; i++) {
          let data = {
            text: 'GW' + i,
            value: i
          };
          list.push(data);
        }
      } else {
        for (let i = 1; i <= this.data.current; i++) {
          if (i < 39) {
            let data = {
              text: 'GW' + i,
              value: i
            };
            list.push(data);
          }
        }
      }
      list.forEach(i => {
        map[i.text] = i.value;
      });
      let columns = [{
        values: list.map(o => o.text),
        className: 'gw',
        defaultIndex: list.length - 1,
      }];
      this.setData({
        gwMap: map,
        columns: columns
      });
    },

  }

})