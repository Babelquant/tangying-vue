<template>
<div class="master flex column">
    <div class="row1 flex flex-centor">
        <div class="test1 "></div>
        <div class="test1 flex column">
          <div style="height:314px;"></div>
          <div style="height:24px;position:relative;">
            <!-- <span class="span-form-head " style="left: 0;">股票</span>
            <span class="span-form-head " style="left: 13%;">涨停价</span>
            <span class="span-form-head " style="left: 28%;">流通值</span>
            <span class="span-form-head " style="left: 42%;">涨停原因</span>
            <span class="span-form-head " style="left: 60%;">涨停形态</span>
            <span class="span-form-head " style="left: 74%">几天几板</span>
            <span class="span-form-head " style="left: 88%">换手率</span> -->

            <span class="span-form-head position-abs" style="left: 0;">股票</span>
            <span class="span-form-head position-abs" style="left: 13%;">涨停价</span>
            <span class="span-form-head position-abs" style="left: 28%;">流通值</span>
            <span class="span-form-head position-abs" style="left: 42%;">涨停原因</span>
            <span class="span-form-head position-abs" style="left: 60%;">涨停形态</span>
            <span class="span-form-head position-abs" style="left: 74%">几天几板</span>
            <span class="span-form-head position-abs" style="left: 88%">换手率</span>
          </div>
          <div class="infinite-list-wrapper" style="height: 108px;overflow:auto;position:relative;">
              <ul 
              class="list"
              v-infinite-scroll="load"
              infinite-scroll-disabled="disabled">
              <li v-for="item in tabledatas" class="list-item">
                <span v-for="chunk in item" class="span-color">{{ chunk }}</span>
                <!-- <span class="span-color position-abs" style="left: 0;">{{ item[0] }}</span>
                <span class="span-color position-abs" style="left: 13%;">{{ item[1] }}</span>
                <span class="span-color position-abs" style="left: 28%;">{{ item[2] }}</span>
                <span class="span-color position-abs" style="left: 42%;">{{ item[3] }}</span>
                <span class="span-color position-abs" style="left: 60%;">{{ item[4] }}</span>
                <span class="span-color position-abs" style="left: 74%;">{{ item[5] }}</span>
                <span class="span-color position-abs" style="left: 88%;">{{ item[6] }}</span> -->
              </li>
              </ul>
              <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
          
          </div>
        </div>
        <div class="test1"></div>
    </div>
    <div class="flex: 1"></div>
</div>
</template>

<script>
    export default {
    data () {
      return {
        count: 5,
        loading: false,
        tabledatas: [],
        alldatas: [],
        row_count: 0
      }
    },
    created() {
      this.getLimitupStocks()
    },
    computed: {
      noMore () {
        return this.count >= 40
      },
      disabled () {
        return this.loading || this.noMore
      }
    },
    methods: {
      load () {
        // console.log(this.tabledatas)
        this.loading = true
        setTimeout(() => {
          this.count += 10
          this.loading = false
          for (let i=0;i<10;i++ ) {
            this.tabledatas.push(this.alldatas[this.count-10+i])
          }
          // this.tabledatas.splice(this.count-10,0,this.alldatas.slice(this.count-10,this.count))
        }, 1000)
      },
      getLimitupStocks () {
        this.axios.get('/tangying/api/v1/data/limitup_stocks/').then(
            res => {
                this.alldatas = res.data
                this.tabledatas = this.alldatas.slice(0,this.count)
                this.row_count = this.alldatas.length
            }
        );
        // return datas
      }
    }
    }
</script>

<style>
    * {
        border: 1px solid black;
    }

    .master {
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: aliceblue;
    }

    .span-form-item {
      background-color: #F2F6FC;
      line-height:1.5;
      font-family: "Hiragino Sans GB";
    }

    .span-form-head {
      font-family: "Microsoft YaHei";
      font-size: 16px Medium;
      font-weight: bold;
      /* display: flex ; */
 
    }

    .position-abs {
      position: absolute;
    }

    .row1 {
        height: 450px;
        margin: 1px;
    }

    .test1 {
        /* height: 100px; */
        width: 33%;
        /* padding: 5px; */
        /* margin: 10px; */
        background-color: white;
        /* display: flex; */
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

    .flex-around {
        justify-content: space-around;
    }

    .flex-between {
        justify-content: space-between;
    }

    .flex-stretch {
        justify-content: stretch;
    }
</style>