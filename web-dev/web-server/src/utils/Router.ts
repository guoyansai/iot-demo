const serverRouter: any = require('../server/router/index');

// 接下来是路由处理的部分
const Router: any = require('koa-router'); // 引入路由插件

// 主路由集结，用来装载所有子路由，并设置子路由前缀
let mainRouter = new Router();

Object.keys(serverRouter).forEach((el: any) => {
  const route = serverRouter[el](new Router());
  mainRouter.use('/' + el, route.routes(), route.allowedMethods());
});

console.log(
  'API服务列表：',
  mainRouter.stack.map((el: any) => el.path)
);

console.log('----------------------------------');

module.exports = mainRouter;
