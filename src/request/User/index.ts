// index.ts
import axios from "@/util/axios";
import { GetUserInfoRes } from "@/types/UserTypes";

// 获取用户信息
export const getUserInfo = (user_id: string) => {
  return axios
    .get<GetUserInfoRes>(`/api/v1/user/get-user-info/${user_id}`)
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
