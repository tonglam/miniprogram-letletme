import {
  get
} from '../../../utils/request';

Component({

  properties: {
    season: String,
    show: Boolean,
  },

  data: {
    team: {},
    teamList: [],
    teamMap: {},
    event: 'pickTeam',
    columns: [],
  },

  lifetimes: {
    attached: function () {
      this.initTeamList();
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
        team: this.data.teamMap[value]
      });
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.team);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

    initTeamList() {
      get('common/qryTeamList', {
          season: this.properties.season
        })
        .then(res => {
          let list = res.data,
            map = {};
          list.forEach(row => {
            map[row.shortName] = {
              id: row.id,
              name: row.name,
              shortName: row.shortName
            }
          });
          this.setData({
            teamList: list,
            teamMap: map,
            team: list[0]
          });
          this.initColumns();
        })
        .catch(res => {
          console.log('fail:', res);
        });
    },

    initColumns() {
      let teamList = this.data.teamList;
      this.setData({
        columns: [{
          values: teamList.map(o => o.shortName),
          className: 'position',
        }, ],
      });
    },

  }

})