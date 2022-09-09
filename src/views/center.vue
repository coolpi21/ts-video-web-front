<template>
  <div class="container">
    <div class="content__wrapper flex-row">
      <div class="avatar__wrapper">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          @change="fileChange($event as File)"
          :http-request="authUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <img v-else :src="avatar" alt="" class="avatar-uploader-icon" />
          <el-button type="primary" class="avatar-button">更换头像</el-button>
        </el-upload>
      </div>
      <div class="user__wrapper">
        <div class="item">
          <div class="label">用户名</div>
          <el-input v-model="username"></el-input>
        </div>
        <div class="item">
          <div class="label">个人签名</div>
          <el-input
            type="textarea"
            v-model="signature"
            placeholder="请输入个人签名"
          ></el-input>
        </div>
        <div class="item text-align-right">
          <el-button type="primary" @click="onUpdateUserInfo">更新</el-button>
        </div>
      </div>
    </div>
    <div class="content__wrapper">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="0">收藏视频</el-menu-item>
      </el-menu>
      <div class="container content flex-row">
        <div
          class="item"
          v-for="(item, index) in collectionVideoList"
          :key="'note' + list"
        >
          <img :src="item.vodCoverImage" alt="" class="coverImage" />
          <div class="info">{{ item.content }}</div>
          <div class="uncollect">
            <el-button @click="onUnCollect(item)">取消收藏</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { userStore } from "../store/user";
import { Video, User } from "../request";
import useUpload from "../hooks/useUpload";
import { ElMessage } from "element-plus";
// import { User as UserIcon } from "@element-plus/icons-vue";

const emit = defineEmits(["after-upload-success"]);
const imageUrl = ref("");

const { fileChange, authUpload } = useUpload(emit, "avatar", imageUrl);
const store = userStore();
const avatar = store.userInfo.avatar;
const phone = store.userInfo.username;
const username = ref("");
username.value = phone;
const signature = ref("");
const collectionVideoList = ref([]);
const activeIndex = ref("0");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

onBeforeMount(() => {
  getCollectionVideoList();
});
/**
 * 获取收藏视频列表
 */
const getCollectionVideoList = async () => {
  const res = await Video.getCollectionVideoList();
  collectionVideoList.value = res.list;
};

/**
 * 取消收藏
 */
const onUnCollect = async (item: any) => {
  await Video.unCollectVideo(item._id);
};

/**
 * 更新用户信息
 */
const onUpdateUserInfo = async () => {
  try {
    await User.updateUserInfo({
      username: username.value,
      channelDesc: signature.value,
    });
    ElMessage({ message: "更新成功", type: "success" });
  } catch (e) {
    console.log("更新用户信息失败", e);
  }
};
</script>
<style scoped lang="scss">
.avatar-uploader {
  position: relative;
  width: 150px;
  height: 150px;
  &:hover {
    .avatar-button {
      opacity: 1;
    }
  }
  .avatar-uploader-icon {
    width: 100%;
    height: 100%;
  }
  .avatar-button {
    position: absolute;
    opacity: 0;
    transition: opacity 0.3s;
  }
  ::v-deep .el-upload {
    width: 100%;
    height: 100%;
  }
  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.container {
  width: 640px;
  margin: 20px auto;
}
.flex-row {
  display: flex;
}
.content__wrapper {
  margin-bottom: 10px;
  .item {
    margin-top: 10px;
    &.text-align-right {
      text-align: right;
    }
    .label {
      margin-bottom: 5px;
    }
  }

  .user__wrapper {
    margin-left: 20px;
    flex: 1;
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
      .uncollect {
        opacity: 1;
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
  .uncollect {
    position: absolute;
    top: 50%;
    transform: transalteY(-50%);
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s;
  }
}
</style>
