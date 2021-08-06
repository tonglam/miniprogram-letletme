Component({

  properties: {
    show: Boolean,
  },

  data: {
    season: '2122',
    event: 'pickSeason',
    columns: [],
  },

  lifetimes: {
    attached: function () {
      this.initSeasonList();
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
        season: value
      });
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.season);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

    initSeasonList() {
      let list = ['2122', '2021', '1920'];
      let columns = [{
        values: list,
        className: 'season',
      }];
      this.setData({
        columns: columns
      });
    },

  }

})