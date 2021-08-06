import {
  get
} from '../../../utils/request';

Component({

  properties: {
    season: String,
    show: Boolean
  },

  data: {
    event: 'pickLeague',
    selectSeason: '2021',
    name: '',
    columns: [],
  },

  lifetimes: {
    attached: function () {
      if (this.properties.season !== '') {
        this.setData({
          selectSeason: this.properties.season
        });
      }
      this.initNameList();
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

    initNameList() {
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
          if (list.size > 0) {
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