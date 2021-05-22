import * as echarts from '../../../../ec-canvas/echarts';

Component({

  options: {
    addGlobalClass: true,
  },
  
  properties: {

  },

  data: {
    ec: {
      lazyLoad: true
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
      let list = this.data.resultList;
      return {
        title: {
          text: "排名走势",
          left: "center",
          top: "0%",
        },
        legend: {},
        tooltip: {
          trigger: 'axis'
        },
        grid: {},
        xAxis: [{
          type: 'category',
          data: Object.values(list).map(o => o.scoutName),
          axisLabel: {
            interval: 0,
            formatter: function (value) {
              //x轴的文字改为竖版显示
              var str = value.split("");
              return str.join("\n");
            }
          }
        }],
        yAxis: [{
          type: 'value'
        }],
        series: []
      };
    },

  },

})
