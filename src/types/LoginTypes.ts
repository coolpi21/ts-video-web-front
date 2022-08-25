// types.ts
// 登录请求体
export interface LoginReqType {
  email: string;
  password: string;
}

// 登录响应体
export interface LoginResType {
  code: number;
  token: string;
  msg: string;
}
