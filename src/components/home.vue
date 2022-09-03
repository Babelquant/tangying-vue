<template>
    <div class="flex column">
        <!-- 第一行 -->
        <div class="flex flex-centor div-height">
            <div id="hot-stocks-chart" class="basic-charts"></div>
            <div class="basic-charts flex column">
                <div id="concept-rank" style="height:280px;"></div>
                <div style="height:190px;">
                    <el-table
                        :data="limituptableData.filter(data => !limituptable_search || data.High_days.toLowerCase().includes(limituptable_search.toLowerCase()))"
                        @row-click="lookCandlestick"
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
                        label="流通值/亿"
                        width="80">
                        </el-table-column>
                        <el-table-column
                        prop="_Reason_type"
                        label="涨停原因"
                        width="130">
                        </el-table-column>
                        <!-- <el-table-column
                        prop="Limitup_type"
                        label="涨停形态"
                        width="80">
                        </el-table-column> -->
                        <el-table-column
                        prop="High_days"
                        label="几天几板"
                        width="80">
                        </el-table-column>
                        <!-- <el-table-column
                        prop="Change_rate"
                        label="换手率"
                        width="70">
                        </el-table-column> -->
                        <el-table-column 
                        align="right">
                        <template slot="header" slot-scope="scope">
                            <el-input
                            v-model="limituptable_search"
                            size="mini"
                            placeholder="几天几板"/>
                        </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="flex:1">
                    <div v-if="stretagyData.length != 0">
                        <vue-marquee style="height:22px;" direction="top" :duration=stretagyData.length*2000 :showProgress="false">
                            <vue-marquee-slide v-for="(item,index) in stretagyData" :key="index">
                                <div style="height:20px;">打板策略：{{ item.Name }} &nbsp; 概念：{{ item._Reason_type}}</div>
                            </vue-marquee-slide>
                        </vue-marquee>
                    </div>
                </div>
            </div>
            <div class="basic-charts flex column">
                <div style="height:35px;margin-left: 5px;">
                    <el-autocomplete
                        class="inline-input"
                        v-model="search_stock"
                        :fetch-suggestions="stockQuerySearch"
                        placeholder="股票名/股票代码"
                        size="small"
                        :clearable="true"
                        :maxlength="8"
                        :trigger-on-focus="false"
                        @select="stockSelect"
                    ></el-autocomplete>
                </div>
                <div id="candlestick" style="display: none;width: 1050px; height:650px">
                    <div id="candlestickMain" style="width: 1050px; height:650px"></div>
                </div>
                <div id="limitupStatistic" style="height:450px;"></div>
            </div>
        </div>
        <!-- 第二行 -->
        <div class="flex flex-centor div-height">
            <div class="basic-charts">
                <el-scrollbar style="height: 100%" wrap-style="overflow-x:hidden;">
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
            <div class="basic-charts flex column">
                <div style="height:30px;margin-left: 2px;margin-bottom: 2px;">
                    <span>
                        <el-select 
                        v-model="search_concepts" 
                        clearable 
                        placeholder="概念"
                        multiple
                        collapse-tags
                        filterable
                        size="mini">
                            <el-option
                            v-for="item in allconcepts"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </span>
                    <span style="margin-left:8px">
                        <el-button 
                        type="primary" 
                        icon="el-icon-search" 
                        size="mini"
                        @click="searchConcepts">选股</el-button>
                    </span>
                </div>
                <div style="height:350px;">
                <el-table
                    v-loading="concept_loading"
                    :data="conceptstretagytableData"
                    :default-sort = "{prop: 'concept_num', order: 'descending'}"
                    height= 400
                    style="width: 100%">
                    <el-table-column
                    prop="name"
                    label="股票名称"
                    width="85">
                    </el-table-column>
                    <el-table-column
                    prop="concept"
                    label="概念叠加"
                    width="130">
                    </el-table-column>
                    <el-table-column
                    prop="last_price"
                    label="最新价"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="increase"
                    label="近1周涨幅"
                    sortable
                    width="150">
                    </el-table-column>
                </el-table>
                </div>
            </div>
            <div class="basic-charts flex column">
                <div style="height:30px;margin-left: 2px;margin-bottom: 2px;">
                    <el-button 
                    type="primary" 
                    size="mini" 
                    plain
                    @click="searchSharpfall">快速下跌</el-button>
                </div>
                <div style="height:350px;">
                <el-table
                    v-loading="sharpfall_loading"
                    :data="sharpfallstretagytableData"
                    height= 400
                    style="width: 100%">
                    <el-table-column
                    prop="股票"
                    label="股票名称"
                    width="85">
                    </el-table-column>
                    <el-table-column
                    prop="行业"
                    label="行业"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="最新价"
                    label="最新价"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="5日跌幅"
                    label="5日跌幅"
                    sortable
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="月内跌幅"
                    label="月内跌幅"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="半年最高跌幅"
                    label="半年最高跌幅"
                    width="120">
                    </el-table-column>
                </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var layer = layui.layer;
    import $ from 'jquery';
    var candlestickChart; //全局变量

    export default {
        data() {
            return {
                limituptableData: [],
                conceptstretagytableData: [],
                sharpfallstretagytableData: [],
                allsecurities: [],
                allconcepts: [],
                stretagyData: [],
                search_stock: '',
                limituptable_search: '',
                search_concepts: null,
                hotRankChart: null,
                timer: null,
                concept_loading: false,
                sharpfall_loading: false,
                activities: [],
                dialogCandlestickVisible: false
            }
        },
        created() {
            this.fullData();
            this.limitupStrategy();
        },
        beforeDestroy() {
            clearInterval(this.timer);
            this.timer = null;
        },
        mounted() {
            this.initHotRankChart();
            this.setHotRankChart();
            this.updateNews();
            this.initConceptRankChart();
            // this.initCandlestickChart();
            // this.setCandlestickOption();
            this.initLimitupStatisticChart();
            this.loadAllSecurities();

            //10分钟更新一次热榜
            this.timer = setInterval(() => {
                setTimeout(this.setHotRankChart(),0)
            },60000*10);
            //5分钟更新一次新闻资讯
            this.timer = setInterval(() => {
                setTimeout(this.updateNews(),0)
            },60000*5);
        },
        methods: {
            fullData () {
                this.axios.get('/tangying/api/v1/data/limitup_stocks/').then( res => {
                    this.limituptableData = res.data
                });
            },
            updateNews() {
                this.axios.get('/tangying/api/v1/data/news/').then( res => {
                    this.activities = res.data
                });
            },
            limitupStrategy() {
                this.axios.get('/tangying/api/v1/data/limitup_strategy/').then( res => {
                    // this.stretagyData = res.data
                    for (let i = 0; i < res.data.length; i++) {
                        this.stretagyData.push(res.data[i]);
                    }
                });
            },
            stockQuerySearch(queryString, cb) {
                var securities = this.allsecurities
                var results = queryString ? securities.filter(this.createFilter(queryString)) : securities;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (obj) => {
                    return (obj.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            loadAllSecurities() {
                this.axios.get('/tangying/api/v1/data/all_securities/').then( res => {
                    // all_securities = res.data;
                    this.allsecurities = res.data;
                });
                this.axios.get('/tangying/api/v1/data/all_concepts/').then( res => {
                    this.allconcepts = res.data;
                });
            },
            lookCandlestick(row) {
                // console.log(row);
                let item = {code: row.Code,value: row.Name};
                this.stockSelect(item);
            },
            //股票k线图弹框
            stockSelect(item) {
                // console.log('select:',item.value);
                this.$nextTick(() => {                       // Can't get dom width or height报错解决方法
                    this.setCandlestickChart(item.code);
                });
                layer.open({
                    type: 1,
                    title: item.value,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['60%', '80%'], //宽高 相对全屏的比例
                    content: $('#candlestick'),
                    end: function() {
                        $('#candlestick').hide();
                    }
                });
            },
            searchConcepts() {
                // console.log('get concept:',this.search_concepts);
                let concepts = this.search_concepts;
                this.concept_loading = true
                // this.$set(this.loading,'concept',true)
                if(concepts.length != 0){
                    concepts = concepts.join(',');
                    this.axios.get('/tangying/api/v1/data/concept_strategy/'+concepts+'/').then( res => {
                        this.conceptstretagytableData = res.data
                        // this.$set(this.loading,'concept',false)
                        this.concept_loading = false
                    });
                }
            },
            searchSharpfall() {
                this.sharpfall_loading = true
                this.axios.get('/tangying/api/v1/data/sharpfall_strategy/').then( res => {
                        this.sharpfallstretagytableData = res.data
                        this.sharpfall_loading = false
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
                name: '人气值'
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
            },
            initConceptRankChart() {
            var chartDom = document.getElementById('concept-rank');
            var ConceptChart = this.$echarts.init(chartDom);
            var option;

            const updateFrequency = 5000;
            const dimension = 1; //哪一列作为横轴维度

            this.axios.get('/tangying/api/v1/data/concept_statistic/').then( res => {
                const data = res.data;
                const dates = [];
                for (let i = 0; i < data.length; ++i) {    //抽取data中所有第3column的数据
                    if (dates.length === 0 || dates[dates.length - 1] !== data[i][3]) {  //去重
                        dates.push(data[i][3]);  
                    };
                }
                let date_set = [...new Set(dates)]
                // console.log('dates:',date_set)
                let startIndex = 1;  //保证data中的3号column有1个不同的值
                let startDate = date_set[startIndex];
                option = {
                grid: {
                    top: 10,
                    bottom: 30,
                    left: 80,
                    right: 20
                },
                xAxis: {
                    max: 'dataMax',
                    axisLabel: {
                    formatter: function (n) {  //n为类目值
                        return Math.round(n) + '';
                    }
                    }
                },
                //将字段date为startDate的data数据过滤出来
                dataset: {//通过date的变化来收集某1个year的所有数据
                    source: data.slice(1).filter(function (d) {  //slice(1)从索引为1的地方开始抽取数据，如果end被省略，则slice会一直提取到原数组末尾
                    return d[3] === startDate;
                    })
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    max: 9,
                    axisLabel: {
                    show: true,
                    fontSize: 12,
                    fontFamily: 'Microsoft YaHei',
                    formatter: '{value}',
                    rich: {
                        flag: {
                        fontSize: 25,
                        padding: 5
                        }
                    }
                    },
                    animationDuration: 500,
                    animationDurationUpdate: 500  //数据更新动画的时长。
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
                    z: 1,
                    zlevel: 1,
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
                        fill: 'rgba(100, 100, 100, 0.75)'
                        },
                        z: 100
                    }
                    ]
                }
                }
                // console.log(option);
                ConceptChart.setOption(option);
                for (let i = startIndex; i < date_set.length - 1; ++i) {
                (function (i) {
                    setTimeout(function () {
                    updateDate(date_set[i + 1]);
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
            },
            initLimitupStatisticChart() {
                var chartDom = document.getElementById('limitupStatistic');
                var myChart = this.$echarts.init(chartDom);
                var option;
                var data_set = [];

                this.axios.get('/tangying/api/v1/data/limitup_statistic/').then( res => {
                    const data = res.data;
                    const dates = [];
                    for (let i = 1; i < data.length; ++i) {    //抽取data中所有下标为2的数据
                            dates.push(data[i][2]);  
                    };
                    let date_set = [...new Set(dates)];
                    // console.log('dates:',date_set);

                    //格式化数据集 [日期 首板数 2天2板数 3天3板数 首板票 2天2板票 3天3板票 1进2淘汰票 2进3淘汰票 1进2成功率 2进3成功率]
                    for  (let i = 0; i < date_set.length; ++i) {
                        let filter_stocks;

                        filter_stocks = data.slice(1).filter(function (d) {return d[2] === date_set[i] && d[0] == '首板'});
                        let stocks_1 = filter_stocks.length>0?filter_stocks[0][1].split(','):[];
                        filter_stocks = data.slice(1).filter(function (d) {return d[2] === date_set[i] && d[0] == '2天2板'});
                        let stocks_2 = filter_stocks.length>0?filter_stocks[0][1].split(','):[];
                        filter_stocks = data.slice(1).filter(function (d) {return d[2] === date_set[i] && d[0] == '3天3板'});
                        let stocks_3 = filter_stocks.length>0?filter_stocks[0][1].split(','):[];
                        data_set.push([
                            date_set[i],
                            stocks_1.length,
                            stocks_2.length,
                            stocks_3.length,
                            stocks_1,
                            stocks_2,
                            stocks_3
                       ])
                    };
                    //筛选淘汰票
                    data_set[0].push([],[]);
                    for  (let i = 1; i < data_set.length; ++i) {
                        data_set[i].push(data_set[i-1][4].filter(item=>{return !data_set[i][5].includes(item)}));
                        data_set[i].push(data_set[i-1][5].filter(item=>{return !data_set[i][6].includes(item)}));
                    };
                    //计算成功率
                    data_set[0].push(NaN,NaN);
                    for  (let i = 1; i < data_set.length; ++i) {
                        data_set[i].push((data_set[i][2]/data_set[i-1][1]*100).toFixed(1));
                        data_set[i].push((data_set[i][3]/data_set[i-1][2]*100).toFixed(1));
                    };
                    // console.log('data_set:',data_set)

                    function splitArray(arr, len){
                        let index = 0;
                        let new_arr = [];
                        while(index < arr.length){
                            new_arr.push(arr.slice(index, index+=len))
                        }
                        return new_arr
                    };
                    option = {
                        dataset: {
                            source: data_set
                        },
                        tooltip: {
                            trigger: 'axis',
                            formatter: function(params) {  //series.encode.tooltip无法实现显示股票名称
                                // console.log('params:',params);
                                let data_1_2 = params[0];
                                let data_2_3 = params[1];
                                let rise_stocks = splitArray(data_1_2.value[5],5);
                                let out_stocks = splitArray(data_1_2.value[7],5);

                                let head_1_2 = data_1_2.marker + data_1_2.seriesName + '&nbsp&nbsp&nbsp&nbsp 成功率：' + data_1_2.value[9] + '%<br/><span style="font-weight:bold">晋级' + data_1_2.value[2] + '支：</span>';
                                for (let i = 0; i < rise_stocks.length; ++i) {
                                    head_1_2 += rise_stocks[i].join(' ') + '<br/>';
                                };
                                head_1_2 += '<span style="font-weight:bold">淘汰' + data_1_2.value[7].length + '支：</span>';
                                for (let i = 0; i < out_stocks.length; ++i) {
                                    head_1_2 += out_stocks[i].join(' ') + '<br/>';
                                };
                                  
                                rise_stocks = splitArray(data_2_3.value[6],5);
                                out_stocks = splitArray(data_2_3.value[8],5);
                                let head_2_3 = data_2_3.marker + data_2_3.seriesName + '&nbsp&nbsp&nbsp&nbsp 成功率:' + data_2_3.value[10] + '%<br/><span style="font-weight:bold">晋级' + data_2_3.value[3] + '支：</span>';
                                for (let i = 0; i < rise_stocks.length; ++i) {
                                    head_2_3 += rise_stocks[i].join(' ') + '<br/>';
                                };
                                head_2_3 += '<span style="font-weight:bold">淘汰' + data_1_2.value[8].length + '支：</span>';
                                for (let i = 0; i < out_stocks.length; ++i) {
                                    head_2_3 += out_stocks[i].join(' ') + '<br/>';
                                };

                                return head_1_2 + '<br/>' + head_2_3
 
                                // params.forEach((item) => {
                                //     let tooltip_style = item.marker + item.seriesName;
                                // });
                            },
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        toolbox: {
                            feature: {
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                            }
                        },
                        legend: {   //图例的数据数组。数组项通常为一个字符串，每一项代表一个系列的 name
                            data: ['1进2', '2进3', '1进2成功率', '2进3成功率']
                            // data: ['日期', '首板', '1进2', '2进3', '1进2成功率', '2进3成功率']
                        },
                        xAxis: [
                            {
                            type: 'category',
                            // data: date_set,
                            axisPointer: {
                                type: 'shadow'
                            },
                            axisLabel: {
                                rotate: -45, //刻度标签倾斜
                                // formatter: function (value, index) {
                                //     return value + 'kg';
                                // }
                            }
                            }
                        ],
                        yAxis: [
                            {
                            type: 'value',
                            name: '数量/支',
                            min: 0,
                            max: function(value) {
                                return value.max;
                            },
                            interval: 20,
                            axisLabel: {
                                formatter: '{value}'
                            }
                            },
                            {
                            type: 'value',
                            name: '成功率',
                            min: 0,
                            max: 100,
                            interval: 20,
                            axisLabel: {
                                formatter: '{value}%'
                            }
                            }
                        ],
                        series: [
                            {
                            name: '1进2',
                            type: 'bar',
                            barMaxWidth: 15,
                            encode: {
                                x: 0, 
                                y: 2,             
                                tooltip: 2
                            }
                            },
                            {
                            name: '2进3',
                            type: 'bar',
                            barMaxWidth: 15,
                            encode: {
                                x: 0, 
                                y: 3,             
                                tooltip: 3
                            }
                            },
                            {
                            name: '1进2成功率',
                            type: 'line',
                            yAxisIndex: 1,  //在单个图表实例中存在多个y轴的时候有用
                            encode: {
                                x: 0, 
                                y: 9,    
                                tooltip: 9      
                            }
                            },
                            {
                            name: '2进3成功率',
                            type: 'line',
                            yAxisIndex: 1,
                            encode: {
                                x: 0, 
                                y: 10,   
                                tooltip: 10
                            }
                            }
                        ]
                    };
                    myChart.setOption(option);
                })

            },
            setCandlestickChart(stock_code) {
                var chartDom = document.getElementById('candlestickMain');

                if (candlestickChart == null||candlestickChart == '') {
                    candlestickChart = this.$echarts.init(chartDom);
                }else {
                    candlestickChart.clear();
                }
                var option;
                const upColor = '#00da3c';
                const downColor = '#ec0000';
                function formatDate(date) {
                    var d = new Date(date),
                        month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear();
                    
                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;
                    
                    return [year, month, day].join('-');
                };
                //分离数据
                function splitData(rawData) {
                    // console.log("type:",typeof(rawData))
                    let categoryData = [];
                    let values = [];
                    let volumes = [];
                    for (let i = 0; i < rawData.length; i++) {
                        // categoryData.push(formatDate(rawData[i].splice(0, 1)[0]));
                        categoryData.push(rawData[i].splice(0, 1)[0]);
                        values.push(rawData[i]);
                        volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? -1 : 1]);
                    }
                    return {
                        categoryData: categoryData,
                        values: values,
                        volumes: volumes
                    };
                };
                function calculateMA(dayCount, data) {
                    var result = [];
                    for (var i = 0, len = data.values.length; i < len; i++) {
                        if (i < dayCount) {
                        result.push('-');
                        continue;
                        }
                        var sum = 0;
                        for (var j = 0; j < dayCount; j++) {
                        sum += data.values[i - j][1];
                        }
                        result.push(+(sum / dayCount).toFixed(3));
                    }
                    return result;
                };
                var data;
                // var _this = this
                this.axios.get('/tangying/api/v1/data/candlestick/'+stock_code+'/',).then( res => {
                    // console.log(stock_name,stock_code,res)
                    data = splitData(res.data);
                    candlestickChart.setOption(
                    (option = {
                        animation: false,
                        legend: {
                            bottom: 10,
                            left: 'center',
                            data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
                        },
                        tooltip: {
                          trigger: 'axis',
                          axisPointer: {
                            type: 'cross'
                          },
                          borderWidth: 1,
                          borderColor: '#ccc',
                          padding: 10,
                          textStyle: {
                            color: '#000'
                          },
                          position: function (pos, params, el, elRect, size) {
                            const obj = {
                              top: 10
                            };
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                            return obj;
                          }
                          // extraCssText: 'width: 170px'
                        },
                        axisPointer: {
                            link: [
                            {
                                xAxisIndex: 'all'
                            }
                            ],
                            label: {
                            backgroundColor: '#777'
                            }
                        },
                        // toolbox: {
                        //     feature: {
                        //     dataZoom: {
                        //         yAxisIndex: false
                        //     },
                        //     brush: {
                        //         type: ['lineX', 'clear']
                        //     }
                        //     }
                        // },
                        brush: {
                            xAxisIndex: 'all',
                            brushLink: 'all',
                            outOfBrush: {
                            colorAlpha: 0.1
                            }
                        },
                        visualMap: {
                            show: false,
                            seriesIndex: 5,
                            dimension: 2,
                            pieces: [
                            {
                                value: 1,
                                color: downColor
                            },
                            {
                                value: -1,
                                color: upColor
                            }
                            ]
                        },
                        grid: [
                            {
                            left: '10%',
                            right: '8%',
                            height: '50%'
                            },
                            {
                            left: '10%',
                            right: '8%',
                            top: '63%',
                            height: '16%'
                            }
                        ],
                        xAxis: [
                            {
                            type: 'category',
                            data: data.categoryData,
                            boundaryGap: false,
                            axisLine: { onZero: false },
                            splitLine: { show: false },
                            min: 'dataMin',
                            max: 'dataMax',
                            axisPointer: {
                                z: 100
                            }
                            },
                            {
                            type: 'category',
                            gridIndex: 1,
                            data: data.categoryData,
                            boundaryGap: false,
                            axisLine: { onZero: false },
                            axisTick: { show: false },
                            splitLine: { show: false },
                            axisLabel: { show: false },
                            min: 'dataMin',
                            max: 'dataMax'
                            }
                        ],
                        yAxis: [
                            {
                            scale: true,
                            splitArea: {
                                show: true
                            }
                            },
                            {
                            scale: true,
                            gridIndex: 1,
                            splitNumber: 2,
                            axisLabel: { show: false },
                            axisLine: { show: false },
                            axisTick: { show: false },
                            splitLine: { show: false }
                            }
                        ],
                        dataZoom: [
                            {
                            type: 'inside',
                            xAxisIndex: [0, 1],
                            start: 98,
                            end: 100
                            },
                            {
                            show: true,
                            xAxisIndex: [0, 1],
                            type: 'slider',
                            top: '85%',
                            start: 98,
                            end: 100
                            }
                        ],
                        series: [
                            {
                            name: 'Dow-Jones index',
                            type: 'candlestick',
                            data: data.values,
                            itemStyle: {
                                color: downColor,
                                color0: upColor,
                                borderColor: undefined,
                                borderColor0: undefined
                            },
                            tooltip: {
                                formatter: function (param) {
                                param = param[0];
                                return [
                                    'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                                    'Open: ' + param.data[0] + '<br/>',
                                    'Close: ' + param.data[1] + '<br/>',
                                    'Lowest: ' + param.data[2] + '<br/>',
                                    'Highest: ' + param.data[3] + '<br/>'
                                ].join('');
                                }
                            }
                            },
                            {
                            name: 'MA5',
                            type: 'line',
                            data: calculateMA(5, data),
                            smooth: true,
                            lineStyle: {
                                opacity: 0.5
                            }
                            },
                            {
                            name: 'MA10',
                            type: 'line',
                            data: calculateMA(10, data),
                            smooth: true,
                            lineStyle: {
                                opacity: 0.5
                            }
                            },
                            {
                            name: 'MA20',
                            type: 'line',
                            data: calculateMA(20, data),
                            smooth: true,
                            lineStyle: {
                                opacity: 0.5
                            }
                            },
                            {
                            name: 'MA30',
                            type: 'line',
                            data: calculateMA(30, data),
                            smooth: true,
                            lineStyle: {
                                opacity: 0.5
                            }
                            },
                            {
                            name: 'Volume',
                            type: 'bar',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: data.volumes
                            }
                        ]
                    }),
                    true);
                });
                candlestickChart.dispatchAction({
                    type: 'brush',
                    areas: [
                    {
                        brushType: 'lineX',
                        coordRange: ['2022-07-02', '2022-07-20'],
                        xAxisIndex: 0
                    }
                    ]
                });
            }
        }
}
</script>

<style lang="less" scoped>
    // * {
    //     border: 1px solid black;
    // }
   .basic-charts {
        width: 600px;
        height: 500px;
        background-color: white;
    }

    .div-height {
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
