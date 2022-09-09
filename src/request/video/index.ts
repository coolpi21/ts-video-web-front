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
  userId: string;
}
export const createVideoPoster = (params: posterReqType) => {
  return axios.post<GetVideoListResType>(`api/v1/video/create-video`, params);
};

// 获取首页视频列表
export const getHomeVideoList = (userId: string) => {
  return axios.get<GetVideoListResType>(`/api/v1/video/get-home-video-list`, {
    userId,
  });
};

// 点赞视频
export const likeVideo = (videoId: string) => {
  return axios.get<GetVideoListResType>(`/api/v1/video/like/${videoId}`);
};

// 取消点赞视频
export const disLikeVideo = (videoId: string) => {
  return axios.get<GetVideoListResType>(`/api/v1/video/dislike/${videoId}`);
};

// 获取当前用户点赞视频
export const getLikeVideoList = () => {
  return axios.get<GetVideoListResType>(`/api/v1/video/like/video-list`);
};

// 获取当前用户收藏视频
export const getCollectVideoList = () => {
  return axios.get<GetVideoListResType>(`/api/v1/video/collection/list`);
};

// 收藏视频
export const collectVideo = (videoId: string) => {
  return axios.get<GetVideoListResType>(`/api/v1/video/collect/${videoId}`);
};

// 取消收藏视频
export const unCollectVideo = (videoId: string) => {
  return axios.get<GetVideoListResType>(`/api/v1/video/uncollect/${videoId}`);
};

// 获取收藏视频列表
export const getCollectionVideoList = () => {
  return axios.get<GetVideoListResType>(
    `/api/v1/video/get-collection-video-list`
  );
};

// 获取视频播放地址
export const getVideoPlayUrl = (videoId: string) => {
  return axios.get<GetVideoListResType>(
    `/api/v1/video/get-video-play-url/${videoId}`
  );
};
