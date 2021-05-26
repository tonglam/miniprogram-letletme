import * as echarts from '../../../../ec-canvas/echarts';

Component({

  options: {
    addGlobalClass: true,
  },

  data: {
    scoreList: [],
    ec: {
      lazyLoad: true
    },
  },

  observers: {
    'scoreList': function () {
      if (this.data.scoreList.length !== 0) {
        this.initChart();
      }
    },
  },

  lifetimes: {
    attached: function () {
      this.ecComponent = this.selectComponent('#mychart');
    },
  },

  methods: {

    initChart() {
      this.ecComponent.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        chart.setOption(this.getOption());
        return chart;
      });
    },

    getOption() {
      return {
        tooltip: {
          trigger: 'item'
        },
        series: [{
          name: '得分',
          type: 'pie',
          radius: ['20%', '60%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          data: this.properties.scoreList,
        }]
      };
    },

  }
})