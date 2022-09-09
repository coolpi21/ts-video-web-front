import { Ref, ref } from "vue";
import { ElMessage } from "element-plus";
import { Upload, User } from "@/request/index";
import { userStore } from "../store/user";

export default (emit: any, type: string, imageUrl: Ref<string>) => {
  let uploader: any,
    authProgress = ref(0),
    statusText = ref(""),
    resumeDisabled = ref(false),
    pauseDisabled = ref(false),
    uploadDisabled = ref(false);
  let uploadVideoId = ref(""),
    uploadImageId = ref("");
  let store = userStore();
  interface UploadFile extends File {
    raw: File;
  }
  const fileChange = (e: File) => {
    const file: UploadFile = e as UploadFile;
    if (!file) {
      ElMessage({
        message: "请先选择需要上传的文件",
        type: "warning",
      });
      return;
    }

    const userData = '{"Vod": {}}';

    if (uploader) {
      uploader.stopUpload();
      authProgress.value = 0;
      statusText.value = "";
    }

    uploader = createUploader();

    uploader.addFile(file.raw, null, null, null, userData);
    uploadDisabled.value = false;
    pauseDisabled.value = true;
    resumeDisabled.value = true;
  };

  const authUpload = () => {
    if (uploader) {
      uploader.startUpload();
    }
  };

  const createUploader = () => {
    let uploader = new AliyunUpload.Vod({
      timeout: 60000,
      partSize: Math.round(1048576),
      parallel: 5,
      retryCount: 3,
      retryDuration: 2,
      region: "cn-shanghai",
      userId: "1303984639806000",
      // 添加文件成功
      addFileSuccess: function (uploadInfo: any) {
        uploadDisabled.value = false;
        resumeDisabled.value = false;
        statusText.value = "添加文件成功, 等待上传...";
        console.log("addFileSuccess: " + uploadInfo.file.name);
      },
      // 开始上传
      onUploadstarted: async function (uploadInfo: any) {
        console.log(uploadInfo);

        // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
        // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
        // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
        // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
        // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
        // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
        if (!uploadInfo.videoId) {
          if (type === "video") {
            try {
              const {
                vod: { UploadAuth, VideoId, UploadAddress },
              } = await Upload.uploadVideo();
              let uploadAuth = UploadAuth;
              let uploadAddress = UploadAddress;
              let videoId = VideoId;
              uploadVideoId.value = videoId;
              uploader.setUploadAuthAndAddress(
                uploadInfo,
                uploadAuth,
                uploadAddress,
                videoId
              );
              statusText.value = "文件开始上传...";
            } catch (e) {
              console.log(e);
            }
          }
          if (type === "avatar") {
            try {
              const { UploadAuth, ImageId, UploadAddress } =
                await Upload.uploadAvatar();
              console.log(UploadAuth, ImageId, UploadAddress);

              let uploadAuth = UploadAuth;
              let uploadAddress = UploadAddress;
              let imageId = ImageId;
              uploadImageId.value = imageId;
              uploader.setUploadAuthAndAddress(
                uploadInfo,
                uploadAuth,
                uploadAddress,
                imageId
              );
              statusText.value = "文件开始上传...";
            } catch (e) {
              console.log(e);
            }
            console.log("头像上传");
          }

          // axios.get(createUrl).then(({ data }) => {

          // });
          // self.statusText = "文件开始上传...";
          // console.log(
          //   "onUploadStarted:" +
          //     uploadInfo.file.name +
          //     ", endpoint:" +
          //     uploadInfo.endpoint +
          //     ", bucket:" +
          //     uploadInfo.bucket +
          //     ", object:" +
          //     uploadInfo.object
          // );
        } else {
          // 如果videoId有值，根据videoId刷新上传凭证
          // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
          // let refreshUrl =
          //   "https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=" +
          //   uploadInfo.videoId;
          // axios.get(refreshUrl).then(({ data }) => {
          //   let uploadAuth = data.UploadAuth;
          //   let uploadAddress = data.UploadAddress;
          //   let videoId = data.VideoId;
          //   uploader.setUploadAuthAndAddress(
          //     uploadInfo,
          //     uploadAuth,
          //     uploadAddress,
          //     videoId
          //   );
          // });
        }
      },
      // 文件上传成功
      onUploadSucceed: async function (uploadInfo: any) {
        console.log(
          "onUploadSucceed: " +
            uploadInfo.file.name +
            ", endpoint:" +
            uploadInfo.endpoint +
            ", bucket:" +
            uploadInfo.bucket +
            ", object:" +
            uploadInfo.object
        );
        statusText.value = "文件上传成功!";
      },
      // 文件上传失败
      onUploadFailed: function (
        uploadInfo: any,
        code: string,
        message: string
      ) {
        console.log(
          "onUploadFailed: file:" +
            uploadInfo.file.name +
            ",code:" +
            code +
            ", message:" +
            message
        );
        statusText.value = "文件上传失败!";
      },
      // 取消文件上传
      onUploadCanceled: function (
        uploadInfo: any,
        code: string,
        message: string
      ) {
        console.log(
          "Canceled file: " +
            uploadInfo.file.name +
            ", code: " +
            code +
            ", message:" +
            message
        );
        statusText.value = "文件已暂停上传";
      },
      // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
      onUploadProgress: function (
        uploadInfo: any,
        totalSize: number,
        progress: number
      ) {
        console.log(
          "onUploadProgress:file:" +
            uploadInfo.file.name +
            ", fileSize:" +
            totalSize +
            ", percent:" +
            Math.ceil(progress * 100) +
            "%"
        );
        let progressPercent = Math.ceil(progress * 100);
        authProgress.value = progressPercent;
        statusText.value = "文件上传中...";
      },
      // 上传凭证超时
      onUploadTokenExpired: function (uploadInfo: any) {
        // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
        // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
        // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
        let refreshUrl =
          "https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=" +
          uploadInfo.videoId;
        axios.get(refreshUrl).then(({ data }) => {
          let uploadAuth = data.UploadAuth;
          uploader.resumeUploadWithAuth(uploadAuth);
          console.log(
            "upload expired and resume upload with uploadauth " + uploadAuth
          );
        });
        statusText.value = "文件超时...";
      },
      // 全部文件上传结束
      onUploadEnd: async function (uploadInfo: any) {
        console.log("onUploadEnd: uploaded all the files");
        statusText.value = "文件上传完毕";
        if (type === "video") {
          ElMessage({ message: "上传成功", type: "success" });
          emit("after-upload-success", uploadVideoId.value);
        }
        if (type === "avatar") {
          const { avatarUrl } = await User.createAvatar(uploadImageId.value);
          imageUrl.value = avatarUrl;
          store.updateUserAvatar(avatarUrl);
          ElMessage({ message: "上传头像成功", type: "success" });
        }
      },
    });

    return uploader;
  };

  return {
    fileChange,
    authUpload,
  };
};
