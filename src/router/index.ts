/** @format */

import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home/HomeView.vue';
import NotFound from '@/views/NotFoundView.vue';
import Cashier from '@/views/Cashier/CashierView.vue';

import Auth from '@/utils/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'cashier' },
      component: Home,
      children: [
        {
          path: 'cashier',
          name: 'cashier',

          component: Cashier,
          beforeEnter: (to, from) => {
            console.log('beforeEnter...', 'to:', to, 'from:', from);
          },
        },
        {
          path: 'goods',
          name: 'goods',
          meta: { requiresAuth: true },
          component: () => import('../views/Goods/GoodsView.vue'),
        },
        {
          path: 'order',
          name: 'order',
          component: () => import('../views/Order/OrderView.vue'),
        },
        {
          path: 'report',
          name: 'report',
          component: () => import('../views/Report/ReportView.vue'),
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('../views/Statistics/StatisticsView.vue'),
        },
        {
          path: 'options',
          name: 'options',
          component: () => import('../views/Options/OptionsView.vue'),
        },
        {
          path: 'test',
          name: 'test',
          component: () => import('../views/Test/TestView.vue'),
        },
        {
          path: 'tools',
          name: 'tools',
          component: () => import('../views/Tools/ToolsView.vue'),
          children: [
            {
              path: 'sheet',
              name: 'tools-sheet',
              component: () => import('../views/Tools/Children/SheetView.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      meta: { requiresAuth: true },
      component: () => import('@/views/Login/Login.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      components: { NotFound },
    },
  ],
});

router.afterEach((to, from) => {
  console.log('afterEach...', 'to:', to, 'from:', from);
});
router.beforeResolve((to, from) => {
  console.log('beforeResolve...', 'to:', to, 'from:', from);
});
router.beforeEach((to, from) => {
  console.log('beforeEach...', 'to:', to, 'from:', from);
  if (to.meta.requiresAuth && !Auth.isLoggedIn) {
    if (to.path !== '/login')
      router.push({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      });
  }
});
console.log('router instance: ', router);

export default router;
