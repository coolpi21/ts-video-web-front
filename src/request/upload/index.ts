// index.ts
import axios from "@/util/axios";
import { UploadVideoResType } from "@/types/UploadVideoTypes";

// 新增登录
export const uploadVideo = () => {
  return axios.get<UploadVideoResType>("/api/v1/video/get-vod");
};