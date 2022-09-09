// index.ts
import axios from "@/util/axios";
import { GetUserInfoRes } from "@/types/UserTypes";

// 获取用户信息
export const getUserInfo = (user_id: string) => {
  return axios
    .get<GetUserInfoRes>(`/api/v1/user/get-user-info/${user_id}`)
    .then((res: any) => res.userInfo);
};

// 更新用户信息
export const updateUserInfo = (params: any) => {
  return axios
    .put<GetUserInfoRes>(`/api/v1/user/user-info`, params)
    .then((res: any) => res.userInfo);
};

// 关注用户
export const followUser = (user_id: string) => {
  return axios.post<GetUserInfoRes>(`api/v1/user/follow-user`, {
    user_id,
  });
};

export const unFollowUser = (user_id: string) => {
  return axios.post<GetUserInfoRes>(`api/v1/user/cancel-follow-user`, {
    user_id,
  });
};

// 获取用户列表（供搜索)
export const getUserList = () => {
  return axios.get<GetUserInfoRes>(`api/v1/user/user-list`);
};

// 创建头像
export const createAvatar = (imageId: string) => {
  return axios.post<GetUserInfoRes>(`api/v1/video/create-avatar`, {
    imageId,
  });
};

// 获取推荐用户列表
export const getRecommendUserList = () => {
  return axios.get<GetUserInfoRes>(`api/v1/user/recommend/user-list`);
};
