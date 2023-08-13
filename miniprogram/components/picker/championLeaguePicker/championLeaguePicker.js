import {
  get
} from '../../../utils/request';

const app = getApp();

Component({

  properties: {
    show: Boolean
  },

  data: {
    event: 'pickChampionLeague',
    name: "",
    map: {},
    championLeagueData: {},
    columns: [],
  },

  lifetimes: {
    attached: function () {
      this.initChampionLeagueList();
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
        championLeagueData: this.data.map[value]
      });
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.championLeagueData);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

    initChampionLeagueList() {
      get('tournament/qryEntryPointsRaceChampionLeague', {
          entry: app.globalData.entryInfoData.entry
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
            championLeagueData:map[Object.keys(map)[0]],
            columns: columns
          });
        })
        .catch(res => {
          console.log('fail:', res);
        });
    },

  },

})