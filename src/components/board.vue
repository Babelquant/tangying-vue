<template>
    <div class="flex flex-center">
        <!-- 左图 -->
        <div class="left-charts">
            <!-- 新闻 -->
            <el-scrollbar style="height: 800px" wrap-style="overflow-x:hidden;">
                <el-timeline>
                    <el-timeline-item 
                    v-for="(activity, index) in activities"
                    :key="index"
                    :color="activity.color"
                    placement="top"
                    :timestamp="activity.datetime">
                    <el-card>
                        <p v-html="activity.content"></p>
                    </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-scrollbar>
        </div>
        <!-- 右图 -->
        <div class="right-charts flex column">
            <div id="hot-stocks-chart" style="height: 800px"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                hotRankChart: null,
                timer1: null,
                timer2: null,
                activities: [],
            }
        },
        beforeDestroy() {
            clearTimeout(this.timer1);
            clearTimeout(this.timer2);
        },
        mounted() {
            this.updateNews();
            this.initHotRankChart();
            this.setHotRankChart();
            //10分钟更新一次热榜
            this.timer1 = setInterval(() => {setTimeout(this.setHotRankChart(),0)},60000*10);
            //5分钟更新一次新闻资讯
            this.timer2 = setInterval(() => {
                setTimeout(this.updateNews(),0)
            },60000*5);
        },
        methods: {
            updateNews() {
                this.axios.get('/tangying/api/v1/data/news/').then( res => {
                    this.activities = res.data
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
                const hotDom = document.getElementById('hot-stocks-chart');
                this.hotRankChart = this.$echarts.init(hotDom);
            },
            setHotRankChart() {
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
                    var start_time = _this.formatterDate(d) + "T09:20";
                    var end_time = _this.formatterDate(d) + "T16:00";

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
                            moveOverlap: 'shiftY'  //垂直位移
                            // hideOverlap: true
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
                    text: '人气榜',
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
                    name: '人气值/万'
                    },
                    grid: {
                        left: 60,
                        right: 80,
                        bottom: 32
                    },
                    series: seriesList
                };
                this.hotRankChart.setOption(option);
                }).catch((er) => {
                    console.log("err:",er);
                });
            }
        }
}
</script>

<style lang="less" scoped>
    // * {
    //     border: 1px solid black;
    // }
   .left-charts {
        width: 700px;
        height: 100%;
        background-color: white;
    }
   .right-charts {
        width: 1000px;
        padding-left: 50px;
        height: 100%;
        background-color: white;
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

    .flex-center {
        justify-content: center;
    }
</style>
