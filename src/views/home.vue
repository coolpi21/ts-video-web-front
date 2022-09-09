<template>
  <div class="content">
    <div class="container mt-20">
      <homeContentVue
        :list="videoList"
        :recommendUserList="recommendUserList"
        @show-comment-list="onShowCommentList"
        @like-video="onHandleLikeVideo"
        @collect-video="onHandleCollectVideo"
        @play-video="onHandlePlayVideo"
      ></homeContentVue>
    </div>
  </div>

  <!-- 评论列表 -->
  <el-dialog v-model="commentListShow" title="评论列表" width="30%">
    <div class="comment-list__wrapper" v-if="commentList.length > 0">
      <div
        class="comment-list"
        v-for="comment in commentList"
        :key="comment._id"
      >
        <el-avatar shape="circle" :src="comment.user.avatar" />
        <div class="info">
          <div class="comment-user-name">{{ comment.user.phone }}</div>
          <div class="comment-content">{{ comment.content }}</div>
        </div>
      </div>
    </div>
    <div class="comment-list__wrapper" v-else>暂无评论</div>
  </el-dialog>

  <!-- 视频播放器 -->
  <Teleport to="body">
    <div v-if="isShowVideo" class="video-panel">
      <div class="mask" @click="onCloseVideoPanel"></div>
      <video :src="playSrc" controls></video>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import homeContentVue from "../components/HomeContent.vue";
import { onBeforeMount, ref, watch } from "vue";
import { userStore } from "@/store/user";
import { useRouter } from "vue-router";
import { Video, User, CommentReq } from "@/request/index";

const store = userStore();

const avatar = store.userInfo.avatar;
const userId = store.userInfo.userId;

const squareUrl = avatar;
const isShowSearchPopover = ref(false);
const searchValue = ref("");
const userList = ref([]);
const hasSearchUserResult = ref(false);
const searchUserResultList = ref([]);
const videoList = ref([]);
const playSrc = ref("");
const isShowVideo = ref(false);
const recommendUserList = ref([]);
const onHandlePlayVideo = async (item: any) => {
  console.log(item);
  const result = await Video.getVideoPlayUrl(item.vodVideoId);
  console.log(result);

  isShowVideo.value = true;
  playSrc.value = result.playUrl;
};

onBeforeMount(() => {
  getVideoList();
  getRecommendUserList();
});

/**
 * 获取推荐用户列表
 */

const getRecommendUserList = async () => {
  const userListInfo = await User.getRecommendUserList();
  recommendUserList.value = userListInfo.userList;
};
/**
 * 获取收藏的视频列表
 */
const getCollectVideoList = async () => {
  const collectListInfo = await Video.getCollectVideoList();
  videoList.value.forEach((v) => {
    if (collectListInfo.collectionList.find((a) => a.video === v._id)) {
      v.isCollect = true;
    } else {
      v.isCollect = false;
    }
  });
};

/**
 * 获取喜欢的视频列表
 */
const getLikeVideoList = async () => {
  const likeListInfo = await Video.getLikeVideoList();
  videoList.value.forEach((v) => {
    if (likeListInfo.likeList.find((a) => a.video === v._id)) {
      v.isLike = true;
    } else {
      v.isLike = false;
    }
  });
};
/**
 * 获取关注视频列表
 */
const getVideoList = async () => {
  const listInfo = await Video.getHomeVideoList(userId);
  videoList.value = listInfo.list;
  getLikeVideoList();
  getCollectVideoList();
};

/**
 * 展示评论
 */
const commentListShow = ref(false);
const commentList = ref([]);
const onShowCommentList = async (id: string) => {
  const result = await CommentReq.getCommentsList(id);
  commentList.value = result.videoComment;
  commentListShow.value = true;
};

/**
 * 点赞视频
 */
const onHandleLikeVideo = async (isLike: boolean, item: any) => {
  const findItem = videoList.value.find((v) => v._id === item._id);
  isLike ? await Video.likeVideo(item._id) : await Video.disLikeVideo(item._id);
  findItem.isLike = !findItem.isLike;
};

/**
 * 收藏视频
 */
const onHandleCollectVideo = async (isCollect: boolean, item: any) => {
  const findItem = videoList.value.find((v) => v._id === item._id);
  isCollect
    ? await Video.collectVideo(item._id)
    : await Video.unCollectVideo(item._id);
  findItem.isCollect = !findItem.isCollect;
};

/**
 * 关闭视频面板
 */

const onCloseVideoPanel = () => {
  isShowVideo.value = false;
};
</script>
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
.video-panel {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    background: rgba(0, 0, 0, 0.3);
  }
  video {
    position: absolute;
    z-index: 1000;
    top: 50%;
    left: 50%;
    width: 640px;
    height: 360px;
    transform: translate(-50%, -50%);
  }
}
</style>
