// index.ts
import axios from "@/util/axios";
import { CommentResType, CommentsListResType } from "@/types/CommentTypes.ts";

// 新增
export const comment = (video_id: string, content: string) => {
  return axios.post<CommentResType>(`/api/v1/video/video-comment/${video_id}`, {
    content,
  });
};

// 获取评论
export const getCommentsList = (video_id: string) => {
  return axios.get<CommentsListResType>(`/api/v1/video/video-list/${video_id}`);
};
