<template>
    <div style="height:550px;">
    <el-table
        :data="boardConceptTable"
        height= 400
        style="width: 100%">
        <el-table-column
        prop="板块名称"
        label="板块概念名称"
        width="110">
        </el-table-column>
        <el-table-column
        prop="涨跌幅"
        label="涨跌幅"
        width="80">
        </el-table-column>
        <el-table-column
        prop="上涨家数"
        label="上涨家数"
        width="80">
        </el-table-column>
        <el-table-column
        prop="下跌家数"
        label="下跌家数"
        width="80">
        </el-table-column>
        <el-table-column
        prop="领涨股票"
        label="领涨股票"
        width="100">
        </el-table-column>
        <el-table-column
        prop="股票涨跌幅"
        label="股票涨跌幅"
        width="100">
        <template slot-scope="scope">
        {{scope.row.股票涨跌幅}}%
        </template>
        </el-table-column>
    </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                timer: null,
                boardConceptTable: []
            };
        },
        beforeDestroy() {
            if(this.timer) {
                clearTimeout(this.timer);
            }
        },
        mounted() {
            //1s更新一次板块概念
            this.timer = setInterval(() => {
                setTimeout(this.updateBoardConceptTable(),0)
            },1000);
        },
        methods: {
            updateBoardConceptTable() {
                this.axios.get('/tangying/api/v1/data/board_concept_data/').then( res => {
                    this.boardConceptTable = res.data
                    // console.log(res.data)
                });
            }
        }
    }
</script>

<style></style>