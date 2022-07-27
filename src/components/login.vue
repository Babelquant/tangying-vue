<template>
    <!-- 登录注册区域 -->
    <div class="login-reg-container">
    <div class="loginAndRegiest">
        <div class="head-box"></div>
        <!-- 登录div -->
        <div class="login-form" >
            <!-- 登录表单 -->
            <form class="layui-form" id="form-login">
                <div class="layui-form-item">
                    <i class="layui-icon layui-icon-username"></i>
                    <input type="text" name="user-name" required  lay-verify="username" placeholder="用户名" autocomplete="off" class="layui-input" />
                </div>
                <div class="layui-form-item">
                    <i class="layui-icon layui-icon-password"></i>
                    <input type="password" name="passwd" required  lay-verify="passwd" placeholder="密码" autocomplete="off" class="layui-input" />
                </div>
                <div class="login-form-item">
                    <button lay-submit class="layui-btn layui-btn-fluid layui-btn-normal" id="login-bt">登录</button>
                </div>
                <!-- 注册 -->
                <div class="reg-box layui-form-item links">
                    <a href="javascript:;" id="reg-link">注册</a>
                </div>
            </form>
        </div>

        <!-- 注册div -->
        <div class="reg-form">
            <!-- 注册表单 -->
            <form class="layui-form" action="">
                <div class="layui-form-item">
                    <i class="layui-icon layui-icon-username"></i>
                    <input type="text" name="user-name" required  lay-verify="username" placeholder="用户名" autocomplete="off" class="layui-input" />
                </div>
                <div class="layui-form-item">
                    <i class="layui-icon layui-icon-password"></i>
                    <input type="password" name="passwd" required  lay-verify="passwd" placeholder="密码" autocomplete="off" class="layui-input" />
                </div>
                <div class="layui-form-item">
                    <i class="layui-icon layui-icon-email"></i>
                    <input type="email" name="email" required  lay-verify="email" placeholder="邮箱" autocomplete="off" class="layui-input" />
                </div>
                <div class="reg-form-item">
                    <button type="button" lay-submit class="layui-btn layui-btn-fluid layui-btn-normal">注册</button>
                </div>

                <!-- 登录 -->
                <div class="layui-form-item links">
                    <a href="javascript:;" id="login-link">登录</a>
                </div>
            </form>
        </div>

    </div>
    </div>
</template>

<script>
import 'layui/dist/layui'
import 'layui/dist/css/layui.css'
import 'layui/dist/css/modules/layer/default/layer.css'
import * as $ from 'jquery'

    export default {}
    $( function() {
        //点击注册的连接    
        $('#reg-link').on('click', function() {
            $('.login-form').hide()
            $('.reg-form').show()
        })

        $('#login-link').on('click', function() {
            $('.login-form').show()
            $('.reg-form').hide()
        })
    })

    //登录表单提交事件
    $('#form-login').submit(function(e){
        e.preventDefault()
        var data = $(this).serialize()
        console.log(data)
        var layer = layui.layer
        layer.msg('登录成功')
        //location.href = "index.html"
    })

    // layui自定义校验规则
    var form = layui.form
    form.verify({
        passwd: [
            /^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'
        ] 
    })
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

    .head-box {
        height: 60px;
        width: 60px;
        /* background: url('/img/tubiao.png')center; */
    }

    .reg-form {
        display: none;
    }

    .layui-form {
        padding: 0 30px;
    }

    .links {
        display: flex;
        justify-content: flex-end;
    }

    .layui-form-item {
        position: relative;
    }

    .layui-icon {
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .layui-input {
        /* position: absolute; */
        text-indent: 32px;
    }
</style>
