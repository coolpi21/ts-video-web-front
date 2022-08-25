import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const userStore = defineStore("user", () => {
  let token = ref<string>("");

  function rejectToken(rejectToken: string) {
    token.value = rejectToken;
  }

  return { token, rejectToken };
});
