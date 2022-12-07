export default [
  {
    path: 'test', // 主路由地址
    alias: 't', // 别名，和路由一样
    name: 'testIndex',
    component: () => import('@/views/test/Index.vue'), // 组件懒加载
    meta: {
      title: '测试', // 页面的标题
    },
    // 这里将独立的路由模块挂载在指定的路由下
    children: [
      {
        path: '',
        alias: '/about',
        name: 'about',
        component: () => import('@/views/test/about/Index.vue'),
        meta: {
          title: 'About',
        },
      },
      {
        path: 'api',
        name: 'api',
        component: () => import('@/views/test/api/Index.vue'),
        meta: {
          title: 'api',
        },
      },
      {
        path: 'props',
        name: 'props',
        component: () => import('@/views/test/props/Index.vue'),
        meta: {
          title: 'props',
        },
      },
      {
        path: 'ws',
        name: 'ws',
        component: () => import('@/views/test/ws/Index.vue'),
        meta: {
          title: 'WS',
        },
      },
      {
        path: 'uuid',
        name: 'uuid',
        component: () => import('@/views/test/uuid/Index.vue'),
        meta: {
          title: 'uuid',
        },
      },
      {
        path: 'layout',
        name: 'layout',
        component: () => import('@/views/test/layout/Index.vue'),
        meta: {
          title: 'layout',
        },
      },
    ],
  },
];
