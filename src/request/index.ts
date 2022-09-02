// // index.ts
// import axios from '../util/axios'
// import { LoginReqType, LoginResType } from '../types/LoginTypes'

// // 新增登录
// export const login = (data: LoginReqType) => {
//   return axios.post<LoginResType>('/api/v1/user/logins', data)
// }

import * as Login from "./login/index";
import * as Upload from "./upload/index";
import * as Video from "./video/index";
import * as User from "./User/index";
import * as CommentReq from "./comment/index";
export { Login, Upload, Video, User, CommentReq };
