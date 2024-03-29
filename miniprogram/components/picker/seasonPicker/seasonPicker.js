/**
 * 默认从1920赛季开始；若mode='player'，从1617赛季开始
 */

const app = getApp();

Component({

  properties: {
    show: Boolean,
    mode:String
  },

  data: {
    season: '',
    event: 'pickSeason',
    columns: [],
  },

  lifetimes: {
    attached: function () {
      let currentSeason = app.globalData.season
      this.setData({
        season: currentSeason
      })
      this.initSeasonList(currentSeason);
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
        season: value[0]
      });
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.season);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

    initSeasonList() {
      let list = ['2324', '2223', '2122', '2021', '1920'];
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