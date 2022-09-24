<template>
    <el-container>
        <el-header>
            <el-menu
            default-active="/review"
            router
            class="el-menu-demo"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="/review">复盘</el-menu-item>
            <el-menu-item index="/board">盘面</el-menu-item>
            <el-menu-item index="/trader">实盘</el-menu-item>
            </el-menu>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    methods: {
  
    }
  }
</script>

<style>
    .el-header, .el-footer {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 50px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        line-height: 100%;
    }

    /* body > .el-container {
        margin-bottom: 40px;
    } */
</style>

