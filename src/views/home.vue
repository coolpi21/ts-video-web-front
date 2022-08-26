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
        <el-avatar shape="square" :src="squareUrl" />
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

const store = userStore();

const squareUrl = ref(store.userInfo.avatar);
const searchValue = ref("");

console.log(store.token);
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
