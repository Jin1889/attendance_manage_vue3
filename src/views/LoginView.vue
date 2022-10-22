<template>
  <div class="login">
    <div class="login_box">
      <div class="login_img">
        <img src="../assets/login.png" alt="" />
      </div>
      <el-form
        :model="loginForm"
        status-icon
        :rules="loginRules"
        label-width="auto"
        label-position="top"
        ref="loginFormRef"
        class="login_form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm(loginFormRef)"
            >登录</el-button
          >
          <el-button type="info" @click="resetForm(loginFormRef)"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 验证码 -->
      <!-- <vcode :show="isShow" @success="success" @close="close" /> -->
    </div>
  </div>
</template>

<script  lang="ts" setup>
import {
  reactive,
  ref,
  getCurrentInstance,
  ComponentInternalInstance
} from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from 'vue-router'
const $router = useRouter()

const loginFormRef = ref<FormInstance>();

const loginForm = reactive({
  username: "",
  password: "",
});

const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "长度在5-12个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 12, message: "长度在6-12个字符", trigger: "blur" },
  ],
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      // console.log("submit!");
      const { data: res } = await proxy.$http.post("api/login", loginForm);
      if (res.status != 200) return alert(res.message);
      window.sessionStorage.setItem("token", res.token)
      // 2.通过编程式导航跳转到后台主页,路由地址是 /home
      $router.push({path: 'home'})
      // console.log(res);
    } else {
      console.log("提交失败!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #4169e1;
}
.login_box {
  width: 45rem;
  height: 27.5rem;
  border-radius: 5px;
  background-color: #ffffff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;

  .login_img {
    width: 50%;
    height: 100%;
    background-color: #f4f9fd;
    display: flex;
    align-items: center;

    img {
      width: 100%;
      box-sizing: border-box;
      padding: 0 1rem;
    }
  }

  .login_form {
    width: 50%;

    .el-form-item {
      margin: 1rem 1rem;
    }

    ::v-deep .el-form-item__content {
      flex: unset;
      justify-content: flex-end;
    }
  }
}
</style>