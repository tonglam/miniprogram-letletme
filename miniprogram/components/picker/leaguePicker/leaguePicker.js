import {
  get
} from '../../../utils/request';

const app = getApp();

Component({

  properties: {
    season: String,
    show: Boolean
  },

  data: {
    event: 'pickLeague',
    selectSeason: '',
    name: '',
    columns: [],
  },

  lifetimes: {
    attached: function () {
      if (this.properties.season !== '') {
        this.setData({
          selectSeason: this.properties.season
        });
      } else {
        this.setData({
          selectSeason: app.globalData.season
        });
      }
      this.initLeagueNameList();
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
        name: value[0]
      });
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.name);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

    initLeagueNameList() {
      get('common/qryAllLeagueName', {
          season: this.data.selectSeason
        })
        .then(res => {
          let list = res.data,
            columns = [{
              values: list,
              className: 'name'
            }];
          this.setData({
            columns: columns
          });
          if (list.length > 0) {
            this.setData({
              name: list[0]
            });
          }
        })
        .catch(res => {
          console.log('fail:', res);
        });
    },

  },

})