// index.ts
import axios from "@/util/axios";
import { GetVideoListResType } from "@/types/VideoTypes";

// 获取视频列表
export const getVideoList = (userId: string) => {
  return axios.get<GetVideoListResType>(
    `/api/v1/video/get-video-list/${userId}`
  );
};
