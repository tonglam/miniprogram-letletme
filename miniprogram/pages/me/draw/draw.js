import {
  get
} from "../../../utils/request";
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

const app = getApp();

Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    tournamentId: 1,
    tournamentName: '让让我瑞士轮第1季季后赛抽签',
    cacheKey: "me-draw-entries::1",
    groupName: '',
    candidateList: [],
    opponentList: [],
    pairResultList: [],
    drawText: '抽签',
    // picker
    showTournamentPicker: false,
    // radio
    position: 0,
    // notice
    drawNoticeText: '',
  },

  /**
   * 原生
   */

  onShow: function () {
    // 设置
    this.setData({
      gw: app.globalData.gw,
      entry: app.globalData.entry,
    });
    // 通知
    this.initDrawNotice();
    // 取缓存
    let candidateList = wx.getStorageSync(this.data.cacheKey);
    if (candidateList.length <= 0) {
      this.initDrawEntries();
    }
    if (candidateList.includes(this.data.entry)) {
      this.navigateHome();
    }
    // 拉取数据
    this.initDrawOpponents();
  },

  onPullDownRefresh: function () {
    this.setData({
      pullDownRefresh: true
    });
    this.refreshDrawResult();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

  // 标签页切换
  tabOnChange(event) {
    let name = event.detail.name;
    if (name === 'draw') {
      // 拉取待抽签数据
      this.initDrawOpponents();
    } else if (name === 'result') {
      // 拉取抽签结果
      this.initDrawPairResults();
    }
  },

  // 单选结果
  onCellChange(event) {
    let position = parseInt(event.detail)
    this.setData({
      position: position,
    });
  },

  // 抽签结果
  onClickDraw() {
    if (this.data.position == 0) {
      Toast({
        type: 'error',
        duration: 2000,
        message: "请选择签位"
      });
      return false;
    }
    if (this.data.drawText === '已抽签') {
      Toast({
        type: 'error',
        duration: 2000,
        message: "请勿重复抽签"
      });
      return false;
    }
    // 二次确认
    Dialog.confirm({
        closeOnClickOverlay: true,
        message: '确认签位为【' + this.data.position + '】？\n确认后不可更改!',
        confirmButtonText: '视死如归',
        cancelButtonText: '想想办法'
      })
      .then(() => {
        this.draw();
        this.setData({
          drawText: '已抽签'
        })
      })
      .catch(() => {});
  },

  // 跳转
  navigateHome() {
    wx.navigateTo({
      url: '/pages/common/home/home'
    });
  },

  /**
   * 数据
   */

  initDrawNotice() {
    get('tournament/qryDrawKnockoutNotice', {
        tournamentId: this.data.tournamentId
      })
      .then(res => {
        if (res.data.id <= 0) {
          return false;
        }
        let text = res.data;
        this.setData({
          drawNoticeText: text
        });
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initDrawEntries() {
    get('tournament/qryDrawKnockoutEntries', {
        tournamentId: this.data.tournamentId
      })
      .then(res => {
        if (res.data.id <= 0) {
          return false;
        }
        let list = res.data;
        this.setData({
          candidateList: list
        });
        // 存缓存
        wx.setStorageSync(this.data.cacheKey, list);
        // 验证
        if (list.includes(this.data.entry)) {
          this.navigateHome();
        }
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initDrawOpponents() {
    get('tournament/qryDrawKnockoutOpponents', {
        tournamentId: this.data.tournamentId,
        entry: this.data.entry
      })
      .then(res => {
        if (res.data.id <= 0) {
          return false;
        }
        let list = res.data,
          groupName = list[0].drawGroupName;
        this.setData({
          opponentList: list,
          groupName: groupName
        });
        let drawed = false;
        list.forEach(element => {
          if (element.drawable) {
            drawed = true;
          }
        });
        if (!drawed) {
          this.setData({
            drawText: '已抽签'
          })
        }
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  draw() {
    get('tournament/drawKnockoutSinglePair', {
        tournamentId: this.data.tournamentId,
        groupName: this.data.groupName,
        entry: this.data.entry,
        position: this.data.position
      })
      .then(res => {
        if (res.data === 'success') {
          Toast({
            type: 'success',
            duration: 1000,
            message: "抽签成功"
          });
        } else {
          Toast({
            type: 'error',
            duration: 1000,
            message: "抽签失败请重试"
          });
        }
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

  initDrawPairResults() {
    get('tournament/qryDrawKnockoutPairs', {
        tournamentId: this.data.tournamentId
      })
      .then(res => {
        if (res.data.id <= 0) {
          return false;
        }
        let list = res.data;
        this.setData({
          pairResultList: list
        });
        console.log(list);
      })
      .catch(res => {
        console.log('fail:', res);
      });
  },

})