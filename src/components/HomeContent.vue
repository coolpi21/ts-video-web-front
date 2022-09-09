<template>
  <div class="home-content__container flex-row justify-content-between">
    <div class="left-side">
      <div
        class="item item-card"
        v-for="(item, index) in list"
        :key="'note' + list"
      >
        <div class="top-content flex-row align-items-center">
          <el-avatar :size="40" :src="item.user.avatar"></el-avatar>
          <span class="username">{{ item.user.phone }}</span>
        </div>
        <div class="middle-content" @click="onHandlePlayVideo(item)">
          <img :src="item.vodCoverImage" alt="" class="coverImage" />
        </div>
        <div
          class="operation-content flex-row align-items-center justify-content-between"
        >
          <Apple
            class="like-icon"
            :color="item.isLike ? 'red' : 'black'"
            @click="onHandleLikeVideo(item)"
          />
          <Star
            class="collect-icon"
            :color="item.isCollect ? '#FFD700' : 'black'"
            @click="onHandleCollectVideo(item)"
          />
        </div>
        <div class="info">{{ `${item.content}` }}</div>
        <div class="comment-watch__area" @click="onShowCommentList(item)">
          查看评论
        </div>

        <div class="comment-area flex-row align-items-center">
          <el-input
            v-model="commentValue[index]"
            placeholder="输入评论"
            class="input-with-select"
          >
            <template #append>
              <el-button :icon="Comment" @click="onSendComment(item, index)" />
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <div class="right-side">
      <div class="top flex-row">
        <h1 class="top-title">为你推荐</h1>
      </div>
      <div class="content">
        <div
          class="user-list flex-row align-items-center justify-content-between"
          v-for="(item, index) in recommendUserList"
        >
          <div class="user-list-left-side flex-row align-items-center">
            <el-avatar :src="item.avatar"></el-avatar>
            <div class="user-name">{{ item.username }}</div>
          </div>
          <div class="user-list-right-side" @click="onFollowHandler(index)">
            {{ item.isFollow === 1 ? "已关注" : "关注" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Apple, Star, Comment } from "@element-plus/icons-vue";
import { CommentReq } from "@/request/index";
import { ElMessage } from "element-plus";
interface UserList {
  avatar: string;
  username: string;
  isFollow: number;
}
// 获取列表数据
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  recommendUserList: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits([
  "show-comment-list",
  "like-video",
  "collect-video",
  "play-video",
]);

/**
 * 评论
 */
const commentValue = ref([]);
const onSendComment = async (item: any, index: number) => {
  if (commentValue.value[index].length === 0) {
    ElMessage({ message: "请输入评论", type: "warning" });
    return;
  }
  try {
    await CommentReq.comment(item._id, commentValue.value[index]);
    commentValue.value[index] = "";
    ElMessage({ message: "评论成功", type: "success" });
  } catch (e) {
    console.log(e);
  }
};

/**
 * 展示评论列表
 */

const onShowCommentList = (item: any) => {
  emit("show-comment-list", item._id);
};

/**
 * 点赞视频
 */
const onHandleLikeVideo = (item: any) => {
  emit("like-video", item.isLike ? false : true, item);
};

/**
 * 收藏视频
 */
const onHandleCollectVideo = (item: any) => {
  emit("collect-video", item.isCollect ? false : true, item);
};

/**
 * 展示视频
 */
const onHandlePlayVideo = (item: any) => {
  emit("play-video", item);
};

/**
 * 关注成员文案
 */
const followText = ref("关注");
const onFollowHandler = (index) => {
  props.recommendUserList[index].isFollow = 1;
};
</script>
<style scoped lang="scss">
.flex-row {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.align-items-center {
  align-items: center;
}
.left-side {
  box-sizing: border-box;
  width: 420px;
  height: auto;
}
.right-side {
  width: 200px;
}

.item-card {
  position: relative;
  width: 100%;
  height: 550px;
  border-radius: 4px;
  overflow: hidden;
  background: #ffffff;
  margin-bottom: 20px;
  border: 1px solid rgb(219, 219, 219);
  .top-content {
    padding: 0 10px;
    height: 52px;
    border-bottom: 1px solid rgb(219, 219, 219);
    .username {
      padding-left: 10px;
      color: rgb(38, 38, 38);
      font-weight: 700;
    }
  }
  .info,
  .comment-user-name {
    color: rgb(38, 38, 38);
    font-weight: 700;
  }
  .middle-content {
    overflow: hidden;
    height: 320px;
    .coverImage {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .operation-content {
    height: 52px;
  }
  .operation-content,
  .info,
  .comment-list {
    padding: 0 10px;
  }

  .like-icon,
  .collect-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .comment-user-name {
    font-size: 16px;
    padding-right: 10px;
  }
  .comment-content {
    font-size: 14px;
  }
  .comment-area {
    box-sizing: border-box;
    width: 100%;
    padding: 0 10px;
    height: 52px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .comment-watch__area {
    margin-top: 10px;
    padding: 0 10px;
    font-size: 12px;
    color: #cccccc;
    cursor: pointer;
  }
}

.right-side {
  .top-title {
    margin: 0;
    font-size: 16px;
    color: rgb(142, 142, 142);
  }
  .user-list {
    margin: 10px 0;
    .user-name {
      color: rgb(38, 38, 38);
      margin-left: 10px;
      font-size: 14px;
    }
    .user-list-right-side {
      color: rgb(0, 149, 246);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
  }
}
</style>
