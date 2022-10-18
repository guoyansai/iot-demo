import { setActivePinia } from 'pinia';
import { createVNode, render } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoadingBar from '../components/LoadingBar.vue';

declare module 'vue-router' {
  interface RouterMeta {
    title: string;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/iot',
    name: 'iot',
    component: () => import('@/views/iot/index.vue'),
  },
  {
    path: '/est',
    name: 'est',
    component: () => import('@/views/EstUi/index.vue'),
  },
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: '',
        name: 'index2',
        component: () => import('@/views/index1.vue'),
      },
    ],
  },
  {
    path: '/index1',
    name: 'index1',
    component: () => import('@/views/index1.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test.vue'),
    meta: {
      title: '测试页面',
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savePosition) => {
    if (savePosition) {
      return savePosition;
    } else {
      return { top: 0 };
    }
  },
});

const Vnode = createVNode(LoadingBar);
render(Vnode, document.body);

const whileList = ['/', '/est', '/iot'];
router.beforeEach((to, from, next) => {
  Vnode.component?.exposed?.startLoading();
  // document.title = to.meta.title;

  console.log(666.111, '路由守卫');
  if (whileList.includes(to.path) || localStorage.getItem('token')) {
    next();
  } else {
    alert('你没有登录！');
    next('/');
  }
});
router.afterEach((to, from) => {
  Vnode.component?.exposed?.endLoading();
});
export default router;
