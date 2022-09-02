// index.ts
import axios from "@/util/axios";
import { UploadVideoResType } from "@/types/UploadVideoTypes";

// 上传视频
export const uploadVideo = () => {
  return axios.get<UploadVideoResType>("/api/v1/video/get-vod");
};

// 上传头像
export const uploadAvatar = () => {
  return axios.get<UploadVideoResType>("/api/v1/user/upload-avatar");
};
