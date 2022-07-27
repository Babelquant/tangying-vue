<template>
    <!-- 登录注册区域 -->
    <div class="login-reg-container">
        <div class="loginAndRegiest">
            <div class="head-box"></div>
            <!-- 登录div -->
            <div class="login-form" >
                <!-- 登录表单 -->
                <!-- <el-form ref="form-login" :model="form"> -->
                <el-form :model="login_form">
                    <el-form-item>
                        <el-input v-model="login_form.input_user" prefix-icon="el-icon-user" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="login_form.input_passwd" prefix-icon="el-icon-lock" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 注册div -->
            <div class="reg-form">
                <!-- 注册表单 -->
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
        return {
            login_form: {
            input_user: '',
            input_passwd: ''
            }
        }
        },
        methods: {
        onSubmit() {
            console.log('submit!');
        }
        }
        }
</script>

<style lang="less" scoped>
    .login-reg-container {
        height: 100%;
        margin: 0%;
        padding: 0;
        background-color: rgb(97, 187, 187);
    }

    .loginAndRegiest {
        width: 400px;
        height: 300px;
        background-color: aliceblue;
        left: 50%;
        top: 50%;
        position: absolute;
        transform: translate(-50%,-50%);
    }

    .login-form {
        padding: 5%;
    }

    .head-box {
        height: 50px;
        width: 50px;
        /* background: url('/img/tubiao.png')center; */
    }

</style>
