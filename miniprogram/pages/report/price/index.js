import moment from 'moment';
import {
  get
} from '../../../utils/request';

const type = ['Rise', 'Faller', 'Start'];

Page({

  data: {
    date: moment().format("YYYY-MM-DD"),
    infoShow: false,
    pickerShow: false,
    // player_value
    riseList: [],
    fallerList: [],
    startList: [],
    // date picker
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return `${value}日`;
    },

  },

  onLoad: function () {
    this.getPirceList();
  },

  onReachBottom: function () {
    console.log('here');
  },

  onShareAppMessage: function () {

  },

  getPirceList() {
    get('report/qryPlayerValueByChangeDate', {
        date: this.data.date
      })
      .then(res => {
        let result = res.data;
        if (JSON.stringify(result) === '{}') {
          this.setData({
            infoShow: false
          });
          return false;
        }
        this.setData({
          riseList: result[type[0]],
          fallerList: result[type[1]],
          startList: result[type[2]],
          infoShow: true
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  onClick() {
    this.setData({
      pickerShow: true
    });
  },

  onConfirm(event) {
    let date = moment(event.detail).format("YYYY-MM-DD");
    this.setData({
      pickerShow: false
    });
    if (date === this.data.date) {
      console.log("重复了");
      return false;
    }
    this.setData({
      date: date
    });
    this.getPirceList();
  },

  onCancel() {
    this.setData({
      pickerShow: false
    });
  },

})