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
        <div class="middle-content">
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
    <div class="right-side">右边</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Apple, Star, Comment } from "@element-plus/icons-vue";
import { CommentReq } from "@/request/index";
import { ElMessage } from "element-plus";
// 获取列表数据
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["show-comment-list", "like-video", "collect-video"]);

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
</style>
