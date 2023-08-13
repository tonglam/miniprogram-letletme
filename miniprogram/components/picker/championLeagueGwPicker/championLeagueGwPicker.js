const app = getApp();

Component({

  properties: {
    startGw: Number,
    endGw: Number,
    show: Boolean
  },

  data: {
    current: 0,
    resultGw: 0,
    event: 'pickGw',
    gwMap: {},
    columns: [],
  },

  lifetimes: {
    attached: function () {
      this.setData({
        resultGw: app.globalData.gw
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
        resultGw: this.data.gwMap[value]
      });
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.resultGw);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

    initGwList() {
      let list = [],
        map = {};
      for (let i = this.properties.startGw; i <= this.properties.endGw; i++) {
        let data = {
          text: 'GW' + i,
          value: i
        };
        list.push(data);
      }
      list.forEach(i => {
        map[i.text] = i.value;
      });
      let columns = [{
        values: list.map(o => o.text),
        className: 'gw',
        defaultIndex: 0,
      }];
      this.setData({
        gwMap: map,
        columns: columns
      });
    },

  }

})