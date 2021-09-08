import {
  get
} from "../../../utils/request";
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

Page({

  data: {
    gw: 0,
    season: '',
    scoutName: '官方推荐阵容',
    // picker
    scouts: ['官方推荐阵容', 'fix推荐阵容', 'scout推荐阵容'],
    showScoutPicker: false,
    showGwPicker: false,
    // refrsh
    pullDownRefresh: false,
    // uploader
    fileList: [],
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      gw: app.globalData.gw
    });
  },

  onPullDownRefresh: function () {

  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // 更换GW
  onClickChangeGw() {
    this.setData({
      showGwPicker: true
    });
  },

  // 更换球探
  onClickChangeScout() {
    this.setData({
      showScoutPicker: true
    });
  },

  // 关闭弹出层
  onScoutPopClose() {
    this.setData({
      showScoutPicker: false
    });
  },

  // picker确认
  onScoutPickerConfirm(event) {
    let scoutName = event.detail.value;
    this.setData({
      showScoutPicker: false,
      scoutName: scoutName,
      pullDownRefresh: false
    });
  },

  // picker取消
  onScoutPickerCancel() {
    this.setData({
      showScoutPicker: false
    });
  },

  // GW选择回填
  onPickGw(event) {
    this.setData({
      showGwPicker: false
    });
    let gw = event.detail;
    if (gw === '' || gw === null) {
      return false;
    }
    if (gw === this.data.gw) {
      return false;
    }
    this.setData({
      gw: gw
    });
    // 拉取数据

  },

  /**
   * 数据
   */

  /**
   * 图片
   */

  uploadToCloud(event) {
    const { file } = event.detail;
    console.log(file); //返回的图片临时地址
    wx.cloud.init();
    const {
      fileList
    } = this.data;
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
      Promise.all(uploadTasks)
        .then(data => {
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          });
          const newFileList = data.map(item => ({
            url: item.fileID
          }));
          this.setData({
            cloudPath: data,
            fileList: newFileList
          });
        })
        .catch(e => {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
          console.log(e);
        });
  },

  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.url
    });
  },

})