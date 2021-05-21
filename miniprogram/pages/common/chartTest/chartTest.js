import { 
  get 
} from '../../../utils/request'; 
import * as echarts from '../../../ec-canvas/echarts'; 
 
Page({ 
 
  data: { 
    ec: { 
      lazyLoad: true 
    }, 
    scoutList: [], 
    eventPointsList: [], 
    totalPointsList: [], 
  }, 
 
  onShow: function () { 
    this.initEventScoutResult(); 
  }, 
 
  onReady: function () { 
    this.ecComponent = this.selectComponent('#mychart'); 
    this.initChart(); 
  }, 
 
  initChart: function () { 
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
      legend: { 
        data: ["周得分"] 
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
        data: this.data.scoutList, 
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
        name: '周得分', 
        type: 'bar', 
        data: this.data.eventPointsList, 
        label: { 
          show: true 
        } 
      }] 
    }; 
  }, 
 
  initEventScoutResult() { 
    get('group/qryEventScoutResult', { 
        event: 37, 
      }) 
      .then(res => { 
        let list = res.data; 
        this.setData({ 
          scoutList: Object.values(list).map(o => o.scoutName), 
          eventPointsList: Object.values(list).map(o => o.eventPoints), 
          totalPointsList: Object.values(list).map(o => o.totalPoints) 
        }); 
      }) 
      .catch(res => { 
        console.log('fail:', res); 
      }); 
  }, 
 
})