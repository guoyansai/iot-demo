import { createRouter, createWebHashHistory } from 'vue-router';
import { createVNode, render } from 'vue';
import LoadingBar from './components/LoadingBar.vue'; // 这是个路由loading模块
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(), // 带#号
  // history: createWebHistory(import.meta.env.BASE_URL), // 需要使用伪静态插件支持
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log(666.102, to, from, savedPosition);
    // 模拟 “滚动到锚点” 的行为
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth', //浏览器支持滚动行为变得更流畅
      };
    }
    if (savedPosition) {
      return savedPosition; // 返回 savedPosition，在按下 后退/前进 按钮时，就会像浏览器的原生表现那样
    } else {
      return { top: 0 };
    }
  },
});

// 通过createVNode挂载成虚拟DOM
const LoadNode = createVNode(LoadingBar);
render(LoadNode, document.body); // 渲染到body中

const whileList = ['/', '/ui', '/index', '/about', '/iot', '/index/ui'];
router.beforeEach((to, from, next) => {
  LoadNode.component?.exposed?.startLoading(); // 启动
  // 赋值给页面的title
  document.title = to?.meta?.title + '';
  console.log(666.111, '路由守卫', to, from, next);
  // 白名单处理
  if (whileList.includes(to.path) || localStorage.getItem('token') || true) {
    next();
  } else {
    alert('你没有登录！');
    next('/');
  }
});

router.afterEach((to, from) => {
  console.log(666.222, '路由加载完成', to, from);
  LoadNode.component?.exposed?.endLoading(); // 加载完成
});

export default router;
