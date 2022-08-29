<template>
  <div class="container flex-row align-center">
    <div class="avatar">
      <el-avatar :size="150" :src="avatar" />
    </div>
    <div class="info">
      <div class="top">
        {{ username }}
      </div>
      <div class="middle flex-row">
        <div class="middle-info__list">{{ count }}个视频</div>
        <div class="middle-info__list">关注者：123123</div>
        <div class="middle-info__list">关注： 22</div>
      </div>
      <div class="bottom">123132131323</div>
    </div>
  </div>
  <div class="container content flex-row">
    <div class="item" v-for="(item, index) in list" :key="'note' + list">
      <img :src="item.vodCoverImage" alt="" class="coverImage" />
      <div class="info">缓解痛经的迷惑行为 求生欲满满</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { Video } from "@/request/index";
import { userStore } from "@/store/user";

const store = userStore();
const { userId, avatar, username } = store.userInfo;
let count = ref(0);
let coverImage = ref("");
let list = ref([]);
onBeforeMount(async () => {
  const listInfo = await Video.getVideoList(userId);
  count.value = listInfo.count;
  list.value = listInfo.list;
  // coverImage.value = list.list[0].vodCoverImage;
});
</script>
<style scoped lang="scss">
.container {
  width: 640px;
  margin: 20px auto;
  padding: 10px 0 20px;
  border-bottom: 1px solid #ffffff;
}

.avatar {
  margin-right: 60px;
}
.flex-row {
  display: flex;
}

.align-center {
  align-items: center;
}

.top {
  margin-bottom: 40px;
  font-size: 26px;
}
.middle {
  margin-bottom: 30px;
  &-info__list {
    margin-right: 10px;
  }
}

.content {
  flex-wrap: wrap;
  .item {
    width: 200px;
    height: 300px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    margin-right: 20px;
    margin-bottom: 20px;
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    &:hover {
      &::after {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 2, 4, 0.2);
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 8px;
        content: "";
      }
    }
  }
  .coverImage {
    height: 220px;
  }
  .info {
    padding: 0;
    margin: 10px 15px;
    color: #000;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
}
</style>
