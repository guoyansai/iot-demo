export default [
  {
    path: 'ide', // 主路由地址
    alias: 'project', // 别名，和路由一样
    name: 'projectIndex',
    component: () => import('@/views/project/index.vue'), // 组件懒加载
    meta: {
      title: '测试', // 页面的标题
    },
    // 这里将独立的路由模块挂载在指定的路由下
    children: [
      // 路由嵌套，拼接主路由与当前子路由，如/index+ui组合成/index/ui
      {
        path: '',
        name: 'uiindex',
        component: () => import('@/views/project/ide/index.vue'),
        meta: {
          title: 'UI主页',
        },
      },
      {
        path: '/:sn?',
        alias: ['', 'ui'],
        name: 'ui',
        component: () => import('@/views/project/ide/index.vue'), // 组件懒加载
        meta: {
          title: 'UI主页',
        },
      },
      {
        path: 'ide007',
        alias: ['', 'ide007'],
        name: 'ide007',
        component: () => import('@/views/project/ide-bak/ide007/index.vue'),
        meta: {
          title: 'UI-第7版本',
        },
      },
    ],
  },
];
