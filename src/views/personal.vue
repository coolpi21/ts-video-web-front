<template>
  <div class="container flex-row align-center">
    <div class="avatar">
      <el-avatar :size="150" :src="avatar" />
    </div>
    <div class="info">
      <div class="top flex-row">
        <div class="user-info">
          {{ username }}
        </div>
        <el-tooltip
          class="box-item"
          effect="light"
          :content="followToolTip"
          placement="bottom"
        >
          <el-button
            :icon="followIconValue"
            :type="followType"
            circle
            v-if="isNotPersonal"
            @click="onFollowHandler"
          ></el-button>
        </el-tooltip>
      </div>
      <div class="middle flex-row">
        <div class="middle-info__list">{{ count }}个视频</div>
        <div class="middle-info__list">关注者：{{ followersCount }}</div>
        <div class="middle-info__list">关注： {{ followCount }}</div>
      </div>
      <div class="bottom">{{ desc }}</div>
    </div>
  </div>
  <div class="container content flex-row">
    <div class="item" v-for="(item, index) in list" :key="'note' + list">
      <img :src="item.vodCoverImage" alt="" class="coverImage" />
      <div class="info">{{ item.content }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from "vue";
import { Video, User } from "@/request/index";
import { userStore } from "@/store/user";
import { Star, Check } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
const store = userStore();
const route = useRoute();
const {
  userInfo: { userId },
} = store;
// 当前访问的UserId
const currentPageUserId = route.params.user_id;
let count = ref(0);
let username = ref("");
let coverImage = ref("");
let avatar = ref("");
let list = ref([]);
let followIconValue = ref(Star);
let followType = ref("primary");
let isFollow = ref(false);
let followCount = ref(0);
let followersCount = ref(0);
let desc = ref("");
let followToolTip = ref("关注");

onBeforeMount(async () => {
  const listInfo = await Video.getVideoList(currentPageUserId);
  const userInfo = await User.getUserInfo(currentPageUserId);
  username.value = userInfo.phone;
  followCount.value = userInfo.followCount;
  followersCount.value = userInfo.followersCount;
  desc.value = userInfo.channelDesc;
  avatar.value = userInfo.avatar;
  count.value = listInfo.count;
  list.value = listInfo.list;
  isFollow.value = userInfo.isFollow;
  // coverImage.value = list.list[0].vodCoverImage;
});

/**
 * 判断isFollow是否关注， 更新FollowType的值
 */
watch(isFollow, (isFollow) => {
  followIconValue.value = isFollow ? Check : Star;
  followType.value = isFollow ? "success" : "primary";
  followToolTip.value = isFollow ? "取消关注" : "关注";
});

/**
 * 判断是否是自己的主页展示关注icon
 */
const isNotPersonal = ref(false);

if (userId !== currentPageUserId) {
  isNotPersonal.value = true;
}

/**
 * 关注用户
 */
const onFollowHandler = async () => {
  if (isFollow.value) {
    // 已关注 -> 取消关注
    await User.unFollowUser(currentPageUserId);
    ElMessage({ message: "取消关注成功", type: "success" });
    followersCount.value -= 1;
    isFollow.value = false;
  } else {
    // 未关注 -> 新增关注
    await User.followUser(currentPageUserId);
    ElMessage({ message: "关注成功", type: "success" });
    followersCount.value += 1;
    isFollow.value = true;
  }
};
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
  .user-info {
    margin-right: 20px;
  }
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
.middle-info__list {
  min-width: 120px;
}
</style>
