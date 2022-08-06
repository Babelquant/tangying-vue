<template>
<div class="top-charts-h flex column">
    <div class="flex flex-centor top-charts-h">
        <div id="hot-stocks-chart" class="top-charts" ref="hotChart"></div>
        <div class="top-charts flex column">
          <div id="concept-rank" style="height:314px;"></div>
          <div class="flex:1">
          </div>
        </div>
        <div class="top-charts"></div>
    </div>
    <div class="flex: 1"></div>
</div>
</template>

<script>

export default {
  mounted() {
    this.initConceptRankChart();
  },
  methods: {
    initConceptRankChart() {
      var chartDom = document.getElementById('concept-rank');
      var myChart = this.$echarts.init(chartDom);
      var option;

      const updateFrequency = 2000;
      const dimension = 1; //哪一列作为横轴维度

      this.axios.get('/tangying/api/v1/data/concept_stocks/').then( res => {
        const data = res.data;
        const dates = [];
        for (let i = 0; i < data.length; ++i) {    //抽取data中所有第3column的数据
          if (dates.length === 0 || dates[dates.length - 1] !== data[i][3]) {  //去重
            dates.push(data[i][3]);  
          }
        }

        let startIndex = 10;  //保证data中的3号column有10个不同的值
        let startDate = dates[startIndex];
        option = {
          grid: {
            top: 10,
            bottom: 30,
            left: 150,
            right: 80
          },
          xAxis: {
            max: 'dataMax',
            axisLabel: {
              formatter: function (n) {  //n为类目值
                return Math.round(n) + '';
              }
            }
          },
          dataset: {//通过year的变化来收集某1个year的所有数据
            source: data.slice(1).filter(function (d) {  //slice(1)从索引为1的地方开始抽取数据，如果end被省略，则slice会一直提取到原数组末尾
              return d[3] === startDate;
            })
          },
          yAxis: {
            type: 'category',
            inverse: true,
            max: 5,
            axisLabel: {
              show: true,
              fontSize: 14,
              formatter: '{value}',
              rich: {
                flag: {
                  fontSize: 25,
                  padding: 5
                }
              }
            },
            // animationDuration: 300,
            // animationDurationUpdate: 300
          },
          series: [
            {
              realtimeSort: true,
              seriesLayoutBy: 'column',//调整维度的方向 此处表示1列为1个维度（默认）
              type: 'bar',
              itemStyle: { //图形样式
                // color: function (param) { //柱条颜色
                //   return countryColors[param.value[3]] || '#5470c6'; //根据国家选颜色
                // }
                color: '#5470c6',
                borderType: 'dashed'
              },
              encode: {  //表示哪个维度映射到哪 数据集中1列表示1个维度
                x: dimension,
                y: 0
              },
              label: {
                show: true,
                precision: 1,
                position: 'right',
                valueAnimation: true,
                fontFamily: 'monospace'
              }
            }
          ],
          // Disable init animation.
          animationDuration: 0,
          animationDurationUpdate: updateFrequency,
          animationEasing: 'linear',
          animationEasingUpdate: 'linear',
          graphic: {
            elements: [
              {
                type: 'text',
                right: 16,
                bottom: 50,
                style: { //z轴样式
                  text: startDate,  //z轴文本
                  font: 'bolder 20px monospace',
                  fill: 'rgba(100, 100, 100, 0.25)'
                },
                z: 100
              }
            ]
          }
        }
        // console.log(option);
        myChart.setOption(option);
        for (let i = startIndex; i < dates.length - 1; ++i) {
          (function (i) {
            setTimeout(function () {
              updateDate(dates[i + 1]);
            }, (i - startIndex) * updateFrequency);
          })(i);
        }
        function updateDate(date) {
          let source = data.slice(1).filter(function (d) {
            return d[3] === date;
          });
          option.series[0].data = source;
          option.graphic.elements[0].style.text = date;
          myChart.setOption(option);
        }
      });
    }
  }
}
</script>

<style>
    /* * {
        border: 1px solid black;
    } */

   .top-charts {
        width: 600px;
        height: 500px;
        background-color: white;
    }

    .top-charts-h {
        height: 500px;
    }

    .flex {
        display: flex;
        /* flex-direction: row; */
    }

    .column {
        flex-direction: column;
    }

    .column-rev {
      flex-direction: column-reverse;
    }

    .flex-centor {
        justify-content: center;
    }
</style>