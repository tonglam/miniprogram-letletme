Component({

  properties: {

  },

  data: {
    event: 'pickResult',
    option: [{
        text: '2122赛季',
        value: '2122'
      },
      {
        text: '2021赛季',
        value: '2021'
      },
      {
        text: '1920赛季',
        value: '1920'
      },
    ],
    value: '2122',
  },

  methods: {

    onChange(event) {
      this.triggerEvent(this.data.event, event.detail);
    },

  }

})