import {
  get
} from '../../../utils/request';

Component({

  properties: {
    show: Boolean
  },

  data: {
    event: 'pickLeague',
    name: '',
    columns: [],
  },

  lifetimes: {
    attached: function () {
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
      get('common/qryAllLeagueName')
        .then(res => {
          let list = res.data,
            columns = [{
              values: list,
              className: 'name'
            }];
          this.setData({
            columns: columns,
            name: list[0]
          });
        })
        .catch(res => {
          console.log('fail:', res);
        });
    },

  },

})