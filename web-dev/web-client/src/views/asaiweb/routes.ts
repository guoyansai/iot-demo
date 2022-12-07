export default [
  {
    path: '', // 主路由地址
    alias: 'asaiweb', // 别名，和路由一样
    name: 'asaiweb',
    component: () => import('@/views/asaiweb/index.vue'), // 组件懒加载
    meta: {
      title: '首页', // 页面的标题
    },
    // 这里将独立的路由模块挂载在指定的路由下
    children: [
      // 路由嵌套，拼接主路由与当前子路由，如/index+ui组合成/index/ui
      {
        path: '',
        name: 'asaiwebindex',
        component: () => import('@/views/asaiweb/index/Index.vue'),
        meta: {
          title: '主页',
        },
      },
      {
        path: 'user',
        alias: ['asaiwebuser', 'users'],
        name: 'user',
        component: () => import('@/views/asaiweb/user/Index.vue'),
        meta: {
          title: 'user页',
        },
      },
      {
        path: 'bbs',
        name: 'bbs',
        component: () => import('@/views/asaiweb/bbs/Index.vue'),
        meta: {
          title: 'bbs页',
        },
      },
      {
        path: 'chat',
        name: 'chat',
        component: () => import('@/views/asaiweb/chat/Index.vue'),
        meta: {
          title: 'chat页',
        },
      },
    ],
  },
];
