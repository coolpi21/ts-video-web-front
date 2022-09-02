<script setup lang="ts">
import UploadVideo from "@/components/UploadVideo.vue";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useRouter, useRoute, routeLocationKey } from "vue-router";

import { Search } from "@element-plus/icons-vue";
import { userStore } from "@/store/user";
import { Video, User, CommentReq } from "@/request/index";
import { storeToRefs } from "pinia";
import { onClickOutside } from "@vueuse/core";
import { ElMessage } from "element-plus";

const router = useRouter();
const store = userStore();
const route = useRoute();

const isShowSearchPopover = ref(false);
const searchValue = ref("");
const userList = ref([]);
const hasSearchUserResult = ref(false);
const searchUserResultList = ref([]);

const { isShowHeader } = storeToRefs(store);
onBeforeMount(() => {
  getUserList();
});

const handleCommand = (command: string | number | object) => {
  switch (command) {
    case "a":
      router.push({
        name: "home",
      });

      break;
    case "b":
      router.push({
        name: "personal",
        params: {
          user_id: store.getUserId,
        },
      });
      break;
    case "c":
      router.push({
        name: "center",
        params: {
          user_id: store.getUserId,
        },
      });
      break;
    case "d":
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      router.push({
        name: "login",
      });
      break;
  }
};

/**
 * 展示发布新帖对话框
 */
const outerVisible = ref(false);

/**
 * 获取搜索用户列表
 */
const getUserList = async () => {
  const { userList: list } = await User.getUserList();
  userList.value = list;
};

const onFocusHandler = () => {
  isShowSearchPopover.value = true;
};
const onBlurHandler = () => {
  isShowSearchPopover.value = false;
};

/**
 * 搜索用户
 */
const onSearchUser = (value: string) => {
  if (value === "") {
    searchUserResultList.value = [];
    return;
  }
  searchUserResultList.value = userList.value.filter((v) => {
    return v.phone.toString().indexOf(value) > -1;
  });
};

const searchTarget = ref(null);
onClickOutside(searchTarget, (event) => (isShowSearchPopover.value = false));

watch(searchUserResultList, (newVal) => {
  if (newVal.length > 0) {
    hasSearchUserResult.value = true;
  } else {
    hasSearchUserResult.value = false;
  }
});

interface SearchUser {
  _id: string;
}
/**
 * 跳转个人主页
 */
const onGoToPersonal = (item: SearchUser) => {
  router.push({
    name: "personal",
    params: {
      user_id: item._id,
    },
  });
};

/**
 * 上传视频成功
 */
const uploadVideoId = ref("");
const onUploadSuccess = (videoId: string) => {
  uploadVideoId.value = videoId;
};

/**
 * 成功提交内容
 */
const posterContent = ref("");
const onSubmitSuccess = (content: string) => {
  posterContent.value = content;
};

/**
 * 发布帖子
 */
const onCreatePost = async () => {
  if (posterContent.value.length === 0) {
    ElMessage({ message: "请输入内容", type: "warning" });
    return;
  }
  if (uploadVideoId.value.length === 0) {
    ElMessage({ message: "请上传视频", type: "warning" });
    return;
  }

  try {
    const res = await Video.createVideoPoster({
      vodVideoId: uploadVideoId.value,
      content: posterContent.value,
      userId: store.getUserId,
    });
    ElMessage({ message: "发布成功", type: "success" });
    outerVisible.value = false;
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <header class="header" v-if="isShowHeader">
    <div class="header-container">
      <div class="header-container__search" ref="searchTarget">
        <el-popover trigger="focus" :visible="isShowSearchPopover" :width="200">
          <template #reference>
            <el-input
              v-model="searchValue"
              placeholder="搜索用户"
              :prefix-icon="Search"
              @focus="onFocusHandler"
              @input="onSearchUser"
            />
          </template>

          <div v-if="!hasSearchUserResult">未搜索到结果</div>
          <div v-else>
            <div
              v-for="item in searchUserResultList"
              :key="item.phone"
              class="flex-row align-items-center user-list__wrapper"
              @click="onGoToPersonal(item)"
            >
              <div class="user-avatar">
                <el-avatar shape="circle" :src="item.avatar" />
              </div>
              <div class="user-name">
                {{ item.phone }}
              </div>
            </div>
          </div>
        </el-popover>
      </div>
      <div class="header-container__new">
        <el-button type="primary" round @click="outerVisible = true"
          >发布新帖</el-button
        >
      </div>
      <div class="header-container__avatar">
        <el-dropdown @command="handleCommand">
          <el-avatar shape="square" :src="store.getAvatarUrl" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a">首页</el-dropdown-item>
              <el-dropdown-item command="b">个人主页</el-dropdown-item>
              <el-dropdown-item command="c">个人中心</el-dropdown-item>
              <el-dropdown-item command="d">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
  <router-view></router-view>
  <!-- 发布帖子 -->
  <el-dialog v-model="outerVisible" title="发布新帖">
    <template #default>
      <UploadVideo
        @after-upload-success="onUploadSuccess"
        @after-submit-content="onSubmitSuccess"
      ></UploadVideo>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="outerVisible = false">取消</el-button>
        <el-button type="primary" @click="onCreatePost">发布</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.container {
  width: 640px;
  margin: 0 auto;
}
.flex-row {
  display: flex;
}
.align-items-center {
  align-items: center;
}
.header {
  height: 52px;
  background: #ffffff;
  &-container {
    position: relative;
    @extend .container;
    height: 100%;
    &__new {
      position: absolute;
      right: 60px;
      top: 50%;
      transform: translateY(-50%);
    }
    &__search {
      width: 180px;
      position: absolute;
      right: 160px;
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
.user-list__wrapper {
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background: #ecf5ff;
  }
}
.user-name {
  margin-left: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.comment-list__wrapper {
  max-height: 400px;
  overflow-y: auto;
}
.comment-list {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 10px;
  &:hover {
    background: #ecf5ff;
  }

  .info {
    margin-left: 10px;
    .comment-user-name {
      color: rgb(38, 38, 38);
      font-weight: 700;
    }
    .comment-content {
      font-size: 14px;
    }
  }
}
</style>
<style>
body {
  margin: 0;
  height: 100vh;
  background: #f6f6f6;
}
</style>
