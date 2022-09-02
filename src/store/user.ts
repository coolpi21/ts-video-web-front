import { reject } from "lodash";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface UserInfo {
  avatar?: string;
  username?: string;
  userId: string;
}

export const userStore = defineStore("user", {
  state: () => {
    return {
      userInfo:
        JSON.parse(localStorage.getItem("userInfo") as string) ||
        ({ avatar: "", userId: "" } as UserInfo),
      token: (localStorage.getItem("token") as string) || "",
      isShowHeader: false,
    };
  },
  getters: {
    getAvatarUrl: (state) => state.userInfo.avatar,
    getUserId: (state) => state.userInfo.userId,
  },
  actions: {
    updateUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    rejectToken(rejectToken: string) {
      this.token = rejectToken;
      localStorage.setItem("token", this.token);
    },
    updateIsShowHeader(isShow: boolean) {
      this.isShowHeader = isShow;
    },
    updateUserAvatar(avatarUrl: string) {
      this.userInfo.avatar = avatarUrl;
      localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
    },
  },
});
