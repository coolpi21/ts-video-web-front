// index.ts
import axios from "@/util/axios";
import { GetVideoListResType } from "@/types/VideoTypes";

// 获取视频列表
export const getVideoList = (userId: string) => {
  return axios.get<GetVideoListResType>(
    `/api/v1/video/get-video-list/${userId}`
  );
};

// 创建视频帖子
interface posterReqType {
  vodVideoId: string;
  content: string;
  userId: string
}
export const createVideoPoster = (params: posterReqType) => {
  return axios.post<GetVideoListResType>(`api/v1/video/create-video`, params);
};
