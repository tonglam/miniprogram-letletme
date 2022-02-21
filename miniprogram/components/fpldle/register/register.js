const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({

  data: {
    event: 'register',
    nickname: '',
    avatarUrl: defaultAvatarUrl,
  },

  methods: {

    onChooseAvatar(event) {
      const {
        avatarUrl
      } = event.detail
      this.setData({
        avatarUrl,
        "userInfo.avatarUrl": avatarUrl
      });
    },

    onInput(event) {
      this.setData({
        nickname: event.detail.value
      });
    },

    onConfirm() {
      let nickname = this.data.nickname,
        avatarUrl = this.data.avatarUrl;
      if (nickname === '' || avatarUrl === '') {
        wx.showToast({
          icon: 'error',
          title: '头像昵称都想要',
        })
        return false;
      }
      let userInfo = {
        openId: this.properties.openId,
        nickname: nickname,
        avatarUrl: avatarUrl,
      };
      this.triggerEvent(this.data.event, userInfo);
    },

    onCancel() {
      this.triggerEvent(this.data.event, "");
    },

  },

})