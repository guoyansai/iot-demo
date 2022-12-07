import { type RouteRecordRaw } from 'vue-router';
// 404页面
import NotFoundComponent from './components/404.vue';
// 前台页面首页
import IndexView from '@/views/Index.vue';
import projectRoutes from '@/views/project/routes'; // project子路由文件
import testRoutes from '@/views/test/routes'; // test子路由文件
import asaiwebRoutes from '@/views/asaiweb/routes'; // test子路由文件

// 定义项目路由
const routes: RouteRecordRaw[] = [
  {
    path: '', // 主路由地址
    alias: '/index', // 别名，和路由一样功能
    name: 'index',
    component: IndexView, // 组件加载
    meta: {
      // meta中可以定义一些页面的元素
      title: '主页', // 页面的标题
    },
    children: [...asaiwebRoutes,...projectRoutes, ...testRoutes],
  },
  { path: '/:pathMatch(.*)', component: NotFoundComponent },
];

export default routes;
