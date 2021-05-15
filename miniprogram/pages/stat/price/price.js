import moment from 'moment';
import {
  get
} from '../../../utils/request';

const type = ['Rise', 'Faller', 'Start'];

Page({

  data: {
    date: moment().format("YYYY-MM-DD"),
    riseInfoShow: false,
    fallerInfoShow: false,
    startInfoShow: false,
    pickerShow: false,
    // player_value
    riseList: [],
    fallerList: [],
    startList: [],
    // date picker
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
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

  onShareAppMessage: function () {
    console.log('share');
  },

  onClickRefresh() {
    this.getPirceList();
  },

  onClickDate() {
    this.setData({
      pickerShow: true
    });
  },

  onPopClose() {
    this.setData({
      pickerShow: false
    });
  },

  onPickerConfirm(event) {
    let date = moment(event.detail).format("YYYY-MM-DD");
    this.setData({
      pickerShow: false
    });
    if (date === this.data.date) {
      return false;
    }
    this.setData({
      date: date
    });
    this.getPirceList();
  },

  onPickerCancel() {
    this.setData({
      pickerShow: false
    });
  },

  getPirceList() {
    get('stat/qryPlayerValueByDate', {
        date: this.data.date
      })
      .then(res => {
        let result = res.data;
        if (JSON.stringify(result) === '{}') {
          this.setData({
            riseInfoShow: true,
            fallerInfoShow: true,
            startInfoShow: true
          });
        }
        let riseList = result[type[0]],
          fallerList = result[type[1]],
          startList = result[type[2]];
        // rise
        if (riseList.length === 0) {
          this.setData({
            riseInfoShow: true
          });
        }
        // faller
        if (fallerList.length === 0) {
          this.setData({
            fallerInfoShow: true
          });
        }
        // start
        if (startList.length === 0) {
          this.setData({
            startInfoShow: true
          });
        }
        this.setData({
          riseList: riseList,
          fallerList: fallerList,
          startList: startList,
          riseInfoShow: false,
          fallerInfoShow: false,
          startInfoShow: false
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})