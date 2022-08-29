import { createWebHistory, createRouter } from "vue-router";
const Login = () => import("../components/Login.vue");
const home = () => import("../views/home.vue");
const personal = () => import("../views/personal.vue");
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
    {
      name: "personal",
      path: "/personal/:user_id",
      component: personal,
    },
  ],
});

router.beforeEach((to, from) => {
  const token = localStorage.getItem("token");

  if (to.name === "home") {
    if (!token) {
      return { name: "login" };
    }
  }
  if (to.name === "login") {
    if (token) {
      return { name: "home" };
    }
  }
});
export default router;
