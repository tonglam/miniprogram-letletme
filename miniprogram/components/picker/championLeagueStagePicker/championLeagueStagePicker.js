import {
  get
} from '../../../utils/request';

Component({

  properties: {
    championLeagueId: Number,
    show: Boolean,
    knockout: Boolean
  },

  data: {
    event: 'pickChampionLeagueStadge',
    stageName: "",
    stage: "",
    map: {},
    columns: [],
  },

  lifetimes: {
    attached: function () {
      this.initChampionLeagueGroupList();
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
      this.initColumns(value[0], value[1]);
    },

    onConfirm() {
      this.triggerEvent(this.data.event, this.data.stage);
    },

    onCancel() {
      this.triggerEvent(this.data.event, '');
    },

    initChampionLeagueGroupList() {
      let url;
      if (this.properties.knockout === true) {
        url = 'tournament/qryChampionLeagueStage';
      } else {
        url = 'tournament/qryChampionLeagueStageGroup';
      }
      get(url, {
          tournamentId: this.properties.championLeagueId
        })
        .then(res => {
          let map = res.data;
          this.setData({
            map: map
          });
          this.initColumns(Object.keys(map)[0]);
        })
        .catch(res => {
          console.log('fail:', res);
        });
    },

    initColumns(stageName, roundName) {
      // change stageName
      if (stageName !== this.data.stageName) {
        roundName = 'undefined';
        this.setData({
          stageName: stageName
        });
      }
      // columns
      let map = this.data.map,
        columns = [{
            values: Object.keys(map),
            className: 'stageName'
          },
          {
            values: map[stageName],
            className: 'value'
          }
        ];
      this.setData({
        columns: columns
      });
      // stage
      let stage;
      if (roundName === 'undefined') {
        stage = stageName + '-' + map[stageName][0];
      } else {
        stage = stageName + '-' + roundName;
      }
      this.setData({
        stage: stage
      });
    }
  },

})