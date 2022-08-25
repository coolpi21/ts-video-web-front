// index.ts
import axios from "@/util/axios";
import { LoginReqType, LoginResType } from "@/types/LoginTypes";

// 新增登录
export const login = (data: LoginReqType) => {
  return axios.post<LoginResType>("/api/v1/user/logins", data);
};
