<template>
<div class="top-charts-h flex column">
    <div class="flex flex-centor top-charts-h">
        <div id="hot-stocks-chart" class="top-charts" ref="hotChart"></div>
        <div class="top-charts flex column">
          <div id="concept-rank" style="height:280px;"></div>
          <div class="flex:1">
              <el-table
                :data="tableData"
                height= 190
                style="width: 100%">
                <el-table-column
                prop="Name"
                label="股票"
                width="80">
                </el-table-column>
                <el-table-column
                prop="Latest"
                label="涨停价"
                width="75">
                </el-table-column>
                <el-table-column
                prop="Currency_value"
                label="流通值"
                width="75">
                </el-table-column>
                <el-table-column
                prop="_Reason_type"
                label="涨停原因"
                width="130">
                </el-table-column>
                <el-table-column
                prop="Limitup_type"
                label="涨停形态"
                width="80">
                </el-table-column>
                <el-table-column
                prop="High_days"
                label="几天几板"
                width="80">
                </el-table-column>
                <el-table-column
                prop="Change_rate"
                label="换手率"
                width="70">
                </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="top-charts"></div>
    </div>
    <div class="flex: 1"></div>
</div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: []
            }
        },
        created() {
            this.fullData()
        },
        mounted() {
            this.initHotRankChart();
            this.initConceptRankChart();
        },
        methods: {
            fullData () {
                this.axios.get('/tangying/api/v1/data/limitup_stocks/').then( res => {
                    this.tableData = res.data
                });
            },
            formatterDate(date) {
                if(!date) {
                    return "";
                };
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var day = date.getDate();
                if (month<10) {
                    month = "0"+month;
                };
                if (day<10) {
                    day = "0"+day;
                };
                var nowDate = year + "-" +month + "-" +day;
                return nowDate
            },
            initHotRankChart() {
                var hotDom = document.getElementById('hot-stocks-chart');
                var hotChart = this.$echarts.init(hotDom);
                var option;
                var top10_stocks;
                
                this.axios.get('/tangying/api/v1/data/hot10_stocks/').then(res => {
                    top10_stocks = res.data;
                });

                //请求热榜数据
                var hot_stocks_data_url = '/tangying/api/v1/data/hot_stocks/';
                this.axios.get(hot_stocks_data_url).then((res) => {
                const datasetWithFilters = [];
                const seriesList = [];
                const _this = this
                this.$echarts.util.each(top10_stocks, function (stock) {
                    var datasetId = '_' + stock;
                    var d = new Date();
                    // var start_time = _this.formatterDate(d);
                    var start_time = _this.formatterDate(d) + "T08:00";
                    var end_time = _this.formatterDate(d) + "T17:00";

                    datasetWithFilters.push({
                    id: datasetId,
                    fromDatasetId: 'dataset_raw',
                    //数据集转换器
                    transform: {
                        type: 'filter', //转换方式
                        config: {//转换条件
                        and: [  //逻辑运算
                            { dimension: 'Time', gte: start_time,parser: 'time' }, //维度:Year 操作符：gte(>=)  比较对象：1950 详细参考文档
                            { dimension: 'Time', lte: end_time,parser: 'time' },
                            { dimension: 'Name', '=': stock } //维度：Country 关系操作符：=  比较对象：country
                        ]
                        }
                    }
                    });
                    seriesList.push({
                        type: 'line',
                        datasetId: datasetId,
                        showSymbol: false, //只在主轴为类目轴时有效,随主轴标签间隔隐藏策略(选中一条线其他线变暗)
                        name: stock,  //系列名称，用于tooltip的显示
                        endLabel: {  //折线图尾部文字
                            show: true,
                            formatter: function (params) {   //回调：尾部文字样式
                            return params.value[0] + ': ' + params.value[1];
                            }
                        },
                        labelLayout: {  //标签重叠时是否挪动标签位置，防重叠
                            // moveOverlap: 'shiftY'  //垂直位移
                            hideOverlap: true
                        },
                        emphasis: {  //在高亮图形时，是否淡出其它数据的图形
                            focus: 'series'  //淡出
                        },
                        encode: {  //可以定义 data 的哪个维度被编码成什么
                            x: 'Time',  //表示维度Time映射到x轴
                            y: 'Popularity',  //表示维度Popularity映射到y轴
                            label: ['Name', 'Rank'],  //表示维度Country、Income的键、 值会在tooltip中显示
                            itemName: 'Time',  //表示维度Time为数据项名称
                            tooltip: ['Rank']  //表示维度Income会在tooltip中显示
                        }
                    });
            });
            option = {
                // 动画时长
                animationDuration: 20000,
                dataset: [
                {
                    id: 'dataset_raw',
                    source: res.data
                },
                ...datasetWithFilters
                ],
                title: {
                text: '人气走势',
                left: "center"
                },
                tooltip: { //多系列提示框浮层排列顺序
                    order: 'valueAsc', //根据数据值, 降序排列
                    trigger: 'axis',  //坐标轴触发
                    textStyle: {
                        fontSize: 6
                    },
                    // backgroundColor: 'rgba(255,255,255,0)', //浮窗透明度
                    position: function (point, params, dom, rect, size) {
                        // console.log(params)
                        // 固定在顶部
                        return [point[0], '10%'];
                    },
                    // enterable: true  //调试使用
                },
                xAxis: {
                type: 'time', //时间轴类型
                nameLocation: 'end', //坐标轴名称显示位置
                axisLabel: {
                    formatter: '{M}/{d}\n{HH}:{mm}'
                }
                },
                yAxis: {
                name: '人气值'
                },
                grid: {
                    left: 60,
                    right: 80,
                    bottom: 32
                },
                series: seriesList
            };
            hotChart.setOption(option);
            }).catch((er) => {
                console.log("err:",er);
            });
            },
            initConceptRankChart() {
            var chartDom = document.getElementById('concept-rank');
            var ConceptChart = this.$echarts.init(chartDom);
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
                // console.log('dates:',dates)
                let startIndex = 1;  //保证data中的3号column有1个不同的值
                let startDate = dates[startIndex];
                option = {
                grid: {
                    top: 10,
                    bottom: 30,
                    left: 50,
                    right: 10
                },
                xAxis: {
                    max: 'dataMax',
                    axisLabel: {
                    formatter: function (n) {  //n为类目值
                        return Math.round(n) + '';
                    }
                    }
                },
                dataset: {//通过date的变化来收集某1个year的所有数据
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
                    animationDuration: 1000,
                    animationDurationUpdate: 300  //数据更新动画的时长。
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
                        color: '#5470c6'
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
                animationDuration: 1000,
                animationDurationUpdate: updateFrequency,
                animationEasing: 'linear',        //初始动画的缓动效果
                animationEasingUpdate: 'linear',  //数据更新动画的缓动效果
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
                ConceptChart.setOption(option);
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
                ConceptChart.setOption(option);
                }
            });
            }
    },
}
</script>

<style lang="less" scoped>
    // * {
    //     border: 1px solid black;
    // }
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
