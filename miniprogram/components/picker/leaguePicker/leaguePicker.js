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
    map: {},
    leagueData: {},
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
        leagueData: this.data.map[value]
      });
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.leagueData);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

    initLeagueNameList() {
      get('common/qryAllLeagueName', {
          season: this.data.selectSeason
        })
        .then(res => {
          let map = {},
            list = [];
          res.data.forEach(element => {
            list.push(element.name);
            map[element.name] = element;
          });
          let columns = [{
            values: list,
            className: 'name'
          }];
          this.setData({
            map: map,
            leagueData: map[Object.keys(map)[0]],
            columns: columns
          });
        })
        .catch(res => {
          console.log('fail:', res);
        });
    },

  },

})