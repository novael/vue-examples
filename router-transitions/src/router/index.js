import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/Home.vue';
import GuidePage from '../pages/Guide.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomePage 
    },
    {
      path: '/guide',
      component: GuidePage
    }
  ]
});

export default router;