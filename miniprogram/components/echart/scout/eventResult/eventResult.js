import * as echarts from '../../../../ec-canvas/echarts';

Component({

  options: {
    addGlobalClass: true,
  },

  data: {
    resultList: [],
    ec: {
      lazyLoad: true
    },
  },

  observers: {
    'resultList': function () {
      if (this.data.resultList.length !== 0) {
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
      let list = this.data.resultList;
      return {
        title: {
          text: "GW" + list[0].event,
          left: "center",
          top: "0%",
        },
        legend: {
          top: "8%",
          left: "15%",
          data: ['门将', '后卫', '中场', '前锋', '队长'],
          textStyle: {
            fontSize: 10
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
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
        series: [{
            name: '得分',
            type: 'bar',
            data: Object.values(list).map(o => o.eventPoints),
            label: {
              show: true
            },
          },
          {
            name: '门将',
            type: 'bar',
            data: Object.values(list).map(o => o.gkpInfo.points),
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            stack: 'total',
          },
          {
            name: '后卫',
            type: 'bar',
            data: Object.values(list).map(o => o.defInfo.points),
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            stack: 'total',
          },
          {
            name: '中场',
            type: 'bar',
            data: Object.values(list).map(o => o.midInfo.points),
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            stack: 'total',
          },
          {
            name: '前锋',
            type: 'bar',
            data: Object.values(list).map(o => o.fwdInfo.points),
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            stack: 'total',
          },
          {
            name: '队长',
            type: 'bar',
            data: Object.values(list).map(o => o.captainInfo.points),
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            stack: 'total',
          }
        ]
      };
    },

  },

})