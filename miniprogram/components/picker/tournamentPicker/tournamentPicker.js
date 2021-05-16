const app = getApp();

import {
  get
} from '../../../utils/request';

Component({

  properties: {
    show: Boolean
  },

  data: {
    event: 'pickTournament',
    name: "",
    map: {},
    tournamentData: {},
    columns: [],
  },

  lifetimes: {
    attached: function () {
      this.initTournamentList();
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
        tournamentData: this.data.map[value]
      });
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.tournamentData);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

    initTournamentList() {
      get('tournament/qryEntryPointsRaceTournament', {
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
            tournamentData:map[Object.keys(map)[0]],
            columns: columns
          });
        })
        .catch(res => {
          console.log('fail:', res);
        });
    },

  },

})