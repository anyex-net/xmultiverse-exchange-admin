<template>
  <div class="login">
    <div class="titleSize">Exchange运营管理平台</div>
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <el-form-item prop="username">
        <el-input
          class="user-input"
          v-model="loginForm.username"
          type="text"
          auto-complete="on"
          placeholder="账号"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            />
            <!--                        <img class="img1" src="../assets/images/user.png" />-->
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            />
            <!--                        <img class="img1" src="../assets/images/psd.png" />-->
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input
          v-model="loginForm.captcha"
          auto-complete="off"
          placeholder="验证码"
          style="width: 60%"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon
              slot="prefix"
              icon-class="validCode"
              class="el-input__icon input-icon"
            />
            <!--                        <img class="img1" src="../assets/images/code.png" />-->
          </template>
        </el-input>
        <div class="login-code" @click="getCode()">
          <span>{{ codeUrl }}</span>
          <!--                    <img :src="codeUrl" @click="getCode()" class="login-code-img" title="看不清？点击更换" />-->
        </div>
      </el-form-item>
      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin: 0px 0px 25px 0px; color: #fff"
        >记住密码
      </el-checkbox>
      <el-form-item style="width: 100%">
        <el-button :loading="loading" class="btn" @click.native="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {} from "vue";
import Login from "@/hooks/login";

const {
  loginFormRef,
  loginForm,
  loginRules,
  handleLogin,
  codeUrl,
  getCode,
  loading,
} = Login();
</script>

<style lang="scss">
.el-input__icon {
  height: 30px !important;
  font-size: 16px;
}

.login {
  min-width: 340px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  background: url("../assets/images/bg.jpg") no-repeat;
  background-size: cover;

  .titleSize {
    min-width: 200px;
    text-align: center;
    font-size: 30px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    color: #fff;
    margin-bottom: 100px;
  }

  .login-form {
    min-width: 340px;
    max-width: 360px;

    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      border-color: #585ce5 !important;
      background-color: #585ce5 !important;
    }

    .el-checkbox__inner:hover {
      border-color: #585ce5 !important;
    }

    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: #585ce5 !important;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #585ce5;
    }

    .el-input {
      //height: 48px;
      //border-radius: 50px;

      .img1 {
        // margin-top: 12px;
        width: 22px;
        height: 22px;
        margin-left: 10px;
      }

      input {
        height: 38px;
        //border-color: #E4F4FF;
        //outline: none;
        //color: #303133 !important;
      }
    }

    .login-code {
      width: 35%;
      box-sizing: border-box;
      height: 38px;
      height: 33px;
      text-align: center;
      margin-left: 15px;
      font-size: 16px;
      color: #ffffff;
      background-color: #585ce5;
      cursor: pointer;
      // float: right;
      display: inline-block;

      .login-code-img {
        height: 38px;
        cursor: pointer;
        vertical-align: middle;
      }
    }

    .btn {
      background: #585ce5;
      color: #ffffff;
      width: 226px;
      margin: 0 auto;
      box-shadow: 0px 1px 1px 1px #585ce5;
    }
  }
}

@media (max-width: 768px) {
  .login {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 30% 5%;

    .titleSize {
      font-size: 22px;
    }

    .login-form {
      width: 100%;
    }
  }
}
</style>
