// types.ts
// 登录请求体
// export interface UploadVideoReqType {
//   email: string;
//   password: string;
// }

// 评论响应体
export interface CommentResType {
  content: string;
}

// 评论列表响应体
export interface CommentsListResType {
  videoComment: any;
  videoCommentCount: number;
}
