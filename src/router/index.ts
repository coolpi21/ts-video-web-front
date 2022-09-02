import { createWebHistory, createRouter } from "vue-router";
import { userStore } from "../store/user";
const Login = () => import("../components/Login.vue");
const home = () => import("../views/home.vue");
const personal = () => import("../views/personal.vue");
const center = () => import("../views/center.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: "login", path: "/login", component: Login },
    {
      name: "home",
      path: "/home",
      component: home,
    },
    {
      name: "personal",
      path: "/personal/:user_id",
      component: personal,
    },
    {
      name: "center",
      path: "/center/:user_id",
      component: center,
    },
  ],
});

router.beforeEach((to, from) => {
  const store = userStore();
  const token = localStorage.getItem("token");
  if (to.name === "home") {
    if (!token) {
      return { name: "login" };
    }
  }
  if (to.name === "login") {
    store.updateIsShowHeader(false);
    if (token) {
      return { name: "home" };
    }
  } else {
    store.updateIsShowHeader(true);
  }
});
export default router;
