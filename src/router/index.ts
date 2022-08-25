import { createWebHistory, createRouter } from "vue-router";
const Login = () => import("../components/Login.vue");
const home = () => import("../views/home.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: Login },
    {
      name: "home",
      path: "/home",
      component: home,
    },
  ],
});

export default router;
