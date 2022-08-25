<template>
  <div class="login-logo__content"></div>
  <div class="login-content__wrapper">
    <div class="logo">短视频社交平台</div>
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      label-width="60px"
      :model="ruleForm"
      style="max-width: 460px"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >登录</el-button
        >
        <el-button @click="resetForm(ruleFormRef)">重置 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, h } from "vue";
import { useRouter } from "vue-router";
import { checkTelNumber } from "../util/reg";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { Login } from "@/request/index";
import { userStore } from "@/store/user";

const store = userStore();

const ruleFormRef = ref<FormInstance>();
const router = useRouter();
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else {
    if (!checkTelNumber(value)) {
      callback(new Error("请输入正确的手机号"));
    } else {
      callback();
    }
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    // if (value.length < 6) {
    //   callback(new Error("输入长度需要大于6个字符"));
    // } else {
    callback();
    // }
  }
};

const ruleForm = reactive({
  phone: "",
  password: "",
});

const rules = reactive({
  phone: [{ validator: validatePass, trigger: "blur" }],
  password: [{ validator: validatePass2, trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const { token } = await Login.login({
        phone: ruleForm.phone,
        password: ruleForm.password,
      });
      store.rejectToken(token);
      ElMessage({
        message: "登入成功",
        type: "success",
      });
      router.push({
        name: "home",
      });
    } else {
      ElMessage({
        message: "登入失败",
        type: "warning",
      });
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped lang="scss">
.logo {
  text-align: center;
  margin-bottom: 12px;
}
.login-logo__content {
  position: absolute;
  left: 400px;
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  height: 360px;
  border: 1px solid #000;
}
.login-content__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 200px;
  top: 50%;
  transform: translateY(-50%);
  color: #262626;
  color: rgba(var(--i1d, 38, 38, 38), 1);
  border: 1px solid #000;
  height: 360px;
  width: 520px;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.login-btn {
  position: relative;
  width: 160px;
}
</style>
