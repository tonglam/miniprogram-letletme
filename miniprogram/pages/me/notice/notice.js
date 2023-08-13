import {
  getNotice
} from '../../../utils/request';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  data: {
    infoList: [],
    num: 0,
    updateTime: '',
    pullDownRefresh: false,
  },

  onShow() {
    this.initNotice();
  },

  onPullDownRefresh() {
    this.setData({
      pullDownRefresh: true
    });
    this.refreshNotice();
  },

  onShareAppMessage: function () {
    return {
      title: 'Hermas包包',
      desc: "更新时间:" + updateTime,
      path: '',
      imageUrl: '****.png'
    }
  },

  onclikeCopy(event) {
    let href = event.target.id;
    this.WxClipboard(href);
  },

  initNotice() {
    getNotice('hermes/queryHermesInfoList', false)
      .then(res => {
        // 下拉刷新
        if (this.data.pullDownRefresh) {
          wx.stopPullDownRefresh({
            success: () => {
              Toast({
                type: 'success',
                duration: 1000,
                message: "刷新成功"
              });
              this.setData({
                pullDownRefresh: false
              });
            },
          });
        }
        let infoList = res.data;
        let updateTime = infoList[0].updateTime,
          num = infoList.length;
        infoList.forEach(element => {
          if (element.newEntry) {
            element.tag = 'NEW'
          }
        });
        this.setData({
          infoList: infoList,
          num: num,
          updateTime: updateTime
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  refreshNotice() {
    getNotice('hermes/refreshHermesInfo')
      .then(() => {
        this.initNotice();
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  // 复制到剪贴板
  WxClipboard(data) {
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

})