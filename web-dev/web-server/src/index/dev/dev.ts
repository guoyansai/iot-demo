// require('../Index')(require('./config.json'));
const config = {
  APP_NODE_TYPE: 'dev',
  APP_HTTP_WS: 'ws',
  APP_HTTP_SSL: 'http',
  APP_HTTP_HOST: '127.0.0.1',
  APP_HTTP_PORT: '9098',
  APP_HTTP_DIR: '../../../../../web/web-client/',
};

const isDev = config.APP_NODE_TYPE === 'dev';

import Koa, { DefaultContext, DefaultState, Context } from 'Koa';

const app: Koa<DefaultState, DefaultContext> = new Koa();

// Web静态资源加载，支持Vue打包网站
const Static = require('koa-static'); // 引入静态资源插件
let webDir = config.APP_HTTP_DIR;
isDev && (webDir = require('path').join(__dirname, webDir));
console.log(666.999,process.cwd(), webDir);
app.use(Static(webDir));

// app.use(
//   Static(webDir, {
//     index: true, // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
//     hidden: false, // 是否同意传输隐藏文件
//     defer: true, // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
//     extensions: ['html'],
//   })
// );

// app.use(async (ctx: Context) => {
//   ctx.body = 'Codroid Server';
// });

app.listen(9098, () => {
  console.log('Codroid服务启动成功，running http://127.0.0.1:9098');
});
