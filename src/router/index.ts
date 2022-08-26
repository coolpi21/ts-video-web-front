import { createWebHistory, createRouter } from "vue-router";
const Login = () => import("../components/Login.vue");
const home = () => import("../views/home.vue");
import { userStore } from "@/store/user";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: "login", path: "/login", component: Login },
    {
      name: "home",
      path: "/home",
      component: home,
    },
  ],
});

router.beforeEach((to, from) => {
  if (to.name === "home") {
    const store = userStore();
    if (!store.token) {
      return { name: "login" };
    }
  }
});
export default router;
