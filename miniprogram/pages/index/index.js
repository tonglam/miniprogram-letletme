import {getDeadline} from '../../utils/utils'
import {get} from '../../utils/https'

Page({

  data: {
    time: 30 * 60 * 60 * 1000,
    nextGw: "",
    deadline: "",
    timeData: {},
  },

  onLoad: function () {
    this.getNextEvent();
  },

  onChange(event) {
    this.setData({
      timeData: event.detail,
    });
  },

  getNextEvent() {
    get('common/getNextEvent')
    .then(res => {
      this.setData({
        nextGw: res.data
      });
      this.getUtcDeadline();
    });
  },

  getUtcDeadline() {
    get('common/getUtcDeadlineByEvent')
    .then(res =>{
      let deadline = getDeadline(res.data);
      this.setData({
        deadline: deadline
      });
    });
  }

});