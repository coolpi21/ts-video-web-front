<template>
  <header class="header">
    <div class="header-container">
      <div class="header-container__search">
        <el-input
          v-model="searchValue"
          placeholder="搜索用户"
          :prefix-icon="Search"
        />
      </div>
      <div class="header-container__avatar">
        <el-dropdown @command="handleCommand">
          <el-avatar shape="square" :src="squareUrl" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a">个人中心</el-dropdown-item>
              <el-dropdown-item command="b">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
  <div class="container">
    <UploadVideo></UploadVideo>
  </div>
</template>

<script lang="ts" setup>
import UploadVideo from "../components/UploadVideo.vue";
import { ref } from "vue";
import { userStore } from "@/store/user";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const store = userStore();
const router = useRouter();
const { avatar, userId } = store.userInfo;
const squareUrl = avatar;

const searchValue = ref("");

const handleCommand = (command: string | number | object) => {
  switch (command) {
    case "a":
      router.push({
        name: "personal",
        params: {
          user_id: userId,
        },
      });
      break;
    case "b":
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      router.push({
        name: "login",
      });
      break;
  }
};
</script>
<style scoped lang="scss">
.container {
  width: 640px;
  margin: 0 auto;
}

.header {
  height: 52px;
  background: #ffffff;
  &-container {
    position: relative;
    @extend .container;
    height: 100%;
    &__search {
      width: 180px;
      position: absolute;
      right: 60px;
      top: 50%;
      transform: translateY(-50%);
    }
    &__avatar {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
