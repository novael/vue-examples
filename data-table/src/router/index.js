import { createRouter, createWebHashHistory } from "vue-router";
import Local from '../components/Local.vue';
import Remote from '../components/Remote.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes:[
    { path: "/", component: Local },
    { path: "/remote", component: Remote }
  ]
});

export default router;