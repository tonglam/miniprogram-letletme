Component({

  properties: {
    gw: Number,
    show: Boolean
  },

  data: {
    event: 'pickGw',
    columns: [],
  },

  lifetimes: {
    attached: function () {
      this.initGwList();
    }
  },

  methods: {

    initGwList() {
      let list = [];
      for (let i = 1; i < this.properties.gw + 1; i++) {
        if (i < 39) {
          list.push(i);
        }
      }
      let columns = [{
        values: list,
        className: 'gw',
        defaultIndex: list.length - 1,
      }];
      this.setData({
        columns: columns
      });
    },

    onClose() {
      this.triggerEvent(this.data.event, '');
    },

    onChange(event) {
      const {
        value
      } = event.detail;
      this.setData({
        gw: value
      });
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.gw);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

  }

})