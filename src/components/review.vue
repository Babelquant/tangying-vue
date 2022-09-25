<template>
    <div class="flex flex-center">
        <!-- 左图 -->
        <div class="left-charts flex column">
            <div id="concept-rank" style="height:300px;"></div>
            <div id="limitupStatistic" style="height:450px;padding-top: 50px;"></div>
        </div>
        <!-- 右图 -->
        <div class="right-charts flex column">
            <div class="flex" style="height:300px;">
                <!-- 涨停池 -->
                <div class="flex column" style="width: 570px;">
                    <el-table
                        :data="limituptableData.filter(data => !limituptable_search || data.High_days.toLowerCase().includes(limituptable_search.toLowerCase()))"
                        @row-click="lookCandlestick"
                        height= 278
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
                        <!-- <el-table-column
                        prop="_Reason_type"
                        label="涨停原因"
                        width="130">
                        </el-table-column> -->
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
                        width="250">
                        <template slot="header" slot-scope="scope">
                            <el-input
                            v-model="limituptable_search"
                            size="mini"
                            placeholder="几天几板"/>
                        </template>
                            <template slot-scope="scope">
                                <span>{{ scope.row._Reason_type }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
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

                <div class="flex column" style="width: 420px;">
                    <div class="flex" style="height: 40%;">
                        <div class="flex:1"  style="padding: 5px;">
                            <el-card  
                            :body-style="{padding: '5px'}" 
                            style="width: 220px;height: 100%;">
                                <div style="height: 20px;" class="text-center">涨停板</div>
                                <div class="flex" style="height: 65px;">
                                    <div class="text-center flex-row-half limitup-num-font" :style="{'color':todayLimitupNum>yestodyLimitupNum?'red':'green'}">{{todayLimitupNum}}</div>
                                    <div class="text-center flex-row-half limitup-num-font">{{yestodyLimitupNum}}</div>
                                </div>
                                <div class="flex" style="height: 20px;">
                                    <div class="text-center flex-row-half">今日</div>
                                    <div class="text-center flex-row-half">昨日</div>
                                </div >
                            </el-card>
                        </div>

                        <div class="flex column">
                            <!-- 股票搜索框 -->
                            <el-autocomplete
                            style="margin-left: auto;" 
                            class="inline-input"
                            v-model="search_stock"
                            :fetch-suggestions="stockQuerySearch"
                            placeholder="股票名/股票代码"
                            size="mini"
                            :clearable="true"
                            :maxlength="8"
                            :trigger-on-focus="false"
                            @select="stockSelect"
                            ></el-autocomplete>
                            <div style="padding-top: 15px;">
                            <!-- 上证指数 -->
                                <el-card
                                :body-style="{padding: '5px'}">
                                    <!-- v-if用于条件判断,判断Dom元素是否显示 -->
                                    <div class="flex" :style="indexColor(shangzheng_index.涨跌额)" v-if="shangzheng_index != null">
                                        <div class="shangzheng-index-font" style="width: 70%;line-height: 60px;">{{shangzheng_index.最新价.toFixed(2)}}</div>
                                        <div class="flex column" style="width: 30%">
                                            <div style="height: 50%;line-height: 30px;">{{shangzheng_index.涨跌额}}</div>
                                            <div style="height: 50%;line-height: 30px;">{{shangzheng_index.涨跌幅.toFixed(2)}}%</div>
                                        </div>
                                    </div>
                                </el-card> 
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex:1"></div>

                    <!-- 股票k线图弹框 -->
                    <div id="candlestick" style="display: none;width: 1050px; height:650px">
                        <div id="candlestickMain" style="width: 1050px; height:650px"></div>
                    </div>
                </div>
            </div>

            <div style="height:30px;padding-top: 50px;">
                <!-- 概念选框 -->
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
                <!-- 选股按钮 -->
                <span style="margin-left:8px">
                    <el-button 
                    type="primary" 
                    icon="el-icon-search" 
                    size="mini"
                    @click="searchConcepts">选股</el-button>
                </span>
            </div>
            <!-- 概念列表 -->
            <div style="height:420px;">
            <el-table
                v-loading="concept_loading"
                :data="conceptstretagytableData"
                @row-click="lookCandlestick"
                :default-sort = "{prop: 'concept_num', order: 'descending'}"
                height= 400
                style="width: 100%">
                <el-table-column
                prop="Name"
                label="股票名称"
                width="85">
                </el-table-column>
                <el-table-column
                prop="Latest"
                label="最新价"
                width="70">
                </el-table-column>
                <el-table-column
                prop="Currency_value"
                label="流通盘/亿"
                width="90">
                </el-table-column>
                <el-table-column
                prop="Change_percent"
                label="涨跌幅"
                width="70">
                </el-table-column>
                <el-table-column
                prop="All_rank"
                label="市场排名"
                width="80">
                </el-table-column>
                <el-table-column
                prop="Ind_rank"
                label="行业排名"
                width="80">
                </el-table-column>
                <el-table-column
                prop="Concept"
                label="概念叠加"
                width="150">
                </el-table-column>
                <el-table-column
                prop="Related_concept"
                label="贴合概念"    
                width="280">
                </el-table-column>
            </el-table>
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
                concept_loading: false,
                sharpfall_loading: false,
                todayLimitupNum: 0,
                yestodyLimitupNum: 0,
                shangzheng_index: null,
                timer: null,
            }
        },
        beforeDestroy() {
            clearInterval(this.timer);
            this.timer = null;
        },
        created() {
            this.fullData();
            this.shangzIndex();
            this.limitupStrategy();
        },
        mounted() {
            this.initConceptRankChart();
            this.initLimitupStatisticChart();
            this.loadAllSecurities();

            //10s更新一次上证指数
            this.timer = setInterval(() => {
                setTimeout(this.shangzIndex(),0)
            },10000);
        },
        computed: {
            indexColor() {
                return(value) => {
                    if (value < 0) {
                        return {'color': 'green'}
                    } else {
                        return {'color': 'red'}
                    }
                }
            }
        },
        methods: {
            fullData () {
                this.axios.get('/tangying/api/v1/data/limitup_stocks/').then( res => {
                    this.limituptableData = res.data
                });
                this.axios.get('/tangying/api/v1/data/new_limitup_pool/').then( res => {
                    this.todayLimitupNum = res.data.length
                });
                this.axios.get('/tangying/api/v1/data/pre_limitup_pool/').then( res => {
                    this.yestodyLimitupNum = res.data.length
                });
            },
            shangzIndex() {
                this.axios.get('/tangying/api/v1/data/sz_index/').then( res => {
                    // console.log('ret:',res.data[0])
                    this.shangzheng_index = res.data[0]
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
                // console.log(column);
                let item = {code: row.Code,value: row.Name,latest: row.Latest};
                this.stockSelect(item);
            },
            //股票k线图弹框
            async stockSelect(item) {
                // console.log('select:',item.value);
                let head;
                let res;

                if (!item.hasOwnProperty('latest')) {
                    res = await this.axios.get('/tangying/api/v1/data/latest_price/'+item.code+'/');
                    item['latest'] = res.data[0].收盘;
                };
                //获取排名情况
                //axios实现同步请求
                res = await this.axios.get('/tangying/api/v1/data/stock_latest_rank/'+item.code+'/');
                let rank_info = res.data;
                // console.log('rank:',rank_info)
                this.$nextTick(() => {                       // Can't get dom width or height报错解决方法
                    this.setCandlestickChart(item.code);
                });
                let rank_cha = rank_info.rankChange;
                let change = rank_cha>0?'<i class="el-icon-top" style="font-size:smaller;color:red">'+rank_cha+'</i>':'<i class="el-icon-bottom" style="font-size:smaller;color:green">'+Math.abs(rank_cha)+'</i>';
                head = [
                    '<span style="font-size:larger;margin-right:10px;">'+item.value+'</span>',
                    '<span style="font-family:Fantasy;font-size:larger;margin-right:15px;">'+item.latest+'</span>',
                    '<span style="font-size:smaller;margin-right:5px;">排名：'+rank_info.rank+'</span>',
                    change
                ].join('');
                // let head = [item.value,head_style];
                layer.open({
                    type: 1,
                    title: head,
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
                            position: function (point,params,dom,rect,size) {
                                // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                                var obj = {top: 20};
                                obj[['left', 'right'][+(point[0] < size.viewSize[0] / 2)]] = 5;
                                return obj;
                            },
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
                //分离数据,衍生新数据
                function splitData(rawData) {
                    // console.log("type:",typeof(rawData))
                    let categoryData = [];
                    let values = [];
                    let volumes = [];
                    for (let i = 0; i < rawData.length; i++) {
                        // categoryData.push(formatDate(rawData[i].splice(0, 1)[0]));
                        categoryData.push(rawData[i].splice(0, 1)[0]); // splice删除（插入）元素，会改变原数组！从index=0开始删除1个元素，返回值为删除掉的元素所组成的数组
                        values.push(rawData[i]); //原数组删除index=0的元素后的数组
                        volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? -1 : 1]); // [index,成交量,涨跌flag]
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
                    data = splitData(res.data);
                    // console.log(stock_code,data)
                    candlestickChart.setOption(
                    (option = {
                        animation: false,
                        legend: {
                            bottom: 10,
                            left: 'center',
                            data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA60']
                        },
                        tooltip: {
                          trigger: 'axis',
                          axisPointer: {
                            type: 'cross'
                          },
                          borderWidth: 1,
                          borderColor: '#ccc',
                          padding: 10,
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          textStyle: {
                            color: '#000'
                          },
                          position: function (pos, params, el, elRect, size) {
                            const obj = {
                              top: 10
                            };
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                            return obj;
                          },
                          formatter: function (param) {
                            param = param[0];
                            // console.log(param);
                            return [
                                param.name + '<hr size=1 style="margin: 3px 0">',
                                '开盘: ' + param.data[1] + '<br/>',
                                '收盘: ' + param.data[2] + '<br/>',
                                '最高: ' + param.data[3] + '<br/>',
                                '最低: ' + param.data[4] + '<br/>',
                                '成交量: ' + (param.data[5]/1000).toFixed(1) + '万手<br/>',
                                '涨跌幅: ' + param.data[8] + '%<br/>',
                                '振幅: ' + param.data[7] + '%'
                            ].join('');
                          },
                        //   extraCssText: 'width: 170px'
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
                        // brush: {
                        //     xAxisIndex: 'all',
                        //     brushLink: 'all',
                        //     outOfBrush: {
                        //     colorAlpha: 0.1
                        //     }
                        // },
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
                            }
                            },
                            {
                            name: 'MA5',
                            type: 'line',
                            data: calculateMA(5, data),
                            smooth: true,
                            showSymbol: false,
                            lineStyle: {
                                opacity: 0.5
                            }
                            },
                            {
                            name: 'MA10',
                            type: 'line',
                            data: calculateMA(10, data),
                            smooth: true,
                            symbol: 'none',
                            lineStyle: {
                                opacity: 0.5
                            }
                            },
                            {
                            name: 'MA20',
                            type: 'line',
                            data: calculateMA(20, data),
                            smooth: true,
                            symbol: 'none',
                            lineStyle: {
                                opacity: 0.5
                            }
                            },
                            {
                            name: 'MA60',
                            type: 'line',
                            data: calculateMA(60, data),
                            smooth: true,
                            symbol: 'none',
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
                // candlestickChart.dispatchAction({
                //     type: 'brush',
                //     areas: [
                //     {
                //         brushType: 'lineX',
                //         coordRange: ['2022-07-02', '2022-07-20'],
                //         xAxisIndex: 0
                //     }
                //     ]
                // });
            }
        }
}
</script>

<style lang="less">
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

    .row-rev {
      flex-direction: row-reverse;
    }

    .flex-row-half {
        width: 50%;
    }

    .flex-center {
        justify-content: center;
    }

    .text-center {
        text-align: center;
    }

    .el-table__body-wrapper::-webkit-scrollbar {
	    width: 0;
    }

    .limitup-num-font {
        font-family: "Fira Mono";
        font-size: 30px;
        line-height: 65px;
        // font-weight: bold;
    }

    .shangzheng-index-font {
        font-family: "Fantasy ";
        font-size: 30px;
    }

</style>
