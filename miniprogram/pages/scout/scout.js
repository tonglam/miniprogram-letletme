Page({

  data: {
    elementType: 0,
    playerList: [],
    pickGkp: "",
    pickDef: "",
    pickMid: "",
    pickFwd: "",
    pickCap: ""
  },

  onLoad: function (options) {
  
  },
 
  getScoutPlayer(e){
    let elementType = e.currentTarget.id;
    // let list = getPlayerList(elementType)
    // this.setData({
    //   playerList: list
    // })
    console.log(list.length);
  },

})