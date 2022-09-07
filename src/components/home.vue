<template>
    <el-container>
        <el-header>
            <el-menu
            default-active="/general"
            router
            class="el-menu-demo"
            mode="horizontal"
            @select="headSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="/general">盘面</el-menu-item>
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
        headSelect(key, keyPath) {
        // console.log(key, keyPath);
      }
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

    body > .el-container {
        margin-bottom: 40px;
    }
</style>

