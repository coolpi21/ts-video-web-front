import { reject } from "lodash";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface UserInfo {
  avatar: string;
  username: string;
}

export const userStore = defineStore("user", {
  state: () => {
    return { userInfo: {}, token: "" };
  },
  actions: {
    rejectToken(rejectToken: string) {
      this.token = rejectToken;
    },
    updateUserInfo(info: UserInfo) {
      this.userInfo = info;
    },
  },
});
