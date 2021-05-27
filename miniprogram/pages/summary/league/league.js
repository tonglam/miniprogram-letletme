Page({

  data: {
    // 数据
    gw: 0,
    entry: 0,
    leagueId:0,
    leagueType:[],
    leagueName: "",
    infoShow: true,
    infoData: {},
    summaryData: {},
    captainData: {},
    transfersData: {},
    scoreData: {},
    // chart
    chartShow: false,
    scoreList: [],
  },

  /**
   * 原生
   */

  onShow: function () {
    this.setData({
      gw: app.globalData.gw,
    });
    // 设置标题
    wx.setNavigationBarTitle({
      title: app.globalData.entryInfoData.playerName,
    })
    // 拉取info
    this.initLeagueSeasonInfo();
    // 拉取summary
    this.initLeagueSeasonSummary();
  },

  onShareAppMessage: function () {

  },

  /**
   * 操作
   */

   // 更换联赛
  onClickChange() {
    this.setData({
      entry: "",
      popShow: true
    });
  },

  tabOnChange(event) {
    let name = event.detail.name;
    if (name === 'summary') {
      this.setData({
        infoShow: true,
        chartShow: false
      });
      // 拉取summary
      this.initLeagueSeasonSummary();
    } else if (name === 'captain') {
      this.setData({
        infoShow: true,
        chartShow: false
      });
      // 拉取captain
      this.initLeagueSeasonCaptain();
    } else if (name === 'transfers') {
      this.setData({
        infoShow: true,
        chartShow: false
      });
      // 拉取transfers
      this.initLeagueSeasonTransfers();
    } else if (name === 'score') {
      this.setData({
        infoShow: true,
        chartShow: false
      });
      // 拉取score
      this.initLeagueSeasonScore();
    } else if (name === 'chart') {
      this.setData({
        infoShow: false,
        chartShow: true
      });
      if (this.data.scoreList.length === 0) {
        // 拉取score
      
      }
    }
  },


})