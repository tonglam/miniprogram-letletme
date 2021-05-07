import { get } from '../../utils/https';
import { getPlayerList } from '../../utils/utils';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    event: "",
    elementType: 0,
    playerList: [],
    pickGkp: "",
    pickDef: "",
    pickMid: "",
    pickFwd: "",
    pickCap: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrentEvent()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取当前周
   */
  getCurrentEvent() {
    get('common/getCurrentEvent')
    .then(res =>{
      thishat.setData({
        event: res.data
      })
    })
  },

  /**
   * 获取推荐球员
   */
  getScoutPlayer(e){
    let elementType = e.currentTarget.id
    let list = getPlayerList(elementType)
    // this.setData({
    //   playerList: list
    // })
    console.log(list.length)
  },

})