module.exports = (config: any) => {
  // 启动ws及http服务，查看端口号被占用方法：CMD命令netstat -ano|findstr 端口号，然后taskkill -PID 进程号 -F
  // 当前运行状态
  const isDev = config.APP_NODE_TYPE === 'dev';

  // 引入koa服务
  const Koa = require('koa');
  const app = new Koa();

  // 解决跨域问题
  const Cors = require('../utils/Cors');
  app.use(Cors);

  // Web静态资源加载，支持Vue打包网站
  const Static = require('koa-static'); // 引入静态资源插件
  let webDir = config.APP_HTTP_DIR;
  if (isDev) {
    webDir = require('path').join(__dirname, webDir);
  } else {
    webDir = process.cwd() + '\\' + webDir;
  }
  app.use(
    Static(webDir, {
      extensions: ['html'],
    })
  );

  // 加载路由为app中间件，后端API开发
  const Router = require('../utils/Router');
  app.use(Router.routes()).use(Router.allowedMethods());

  // http服务
  const http = require('http');
  const Server = http.createServer(app.callback());

  // ws服务
  const Ws: any = require('../utils/Ws');
  Ws(Server);

  start(+config.APP_HTTP_PORT);

  async function start(port: number) {
    // 寻找可用端口号
    const portfinder = require('portfinder');
    port = await portfinder.getPortPromise({ port });
    Server.listen(port, config.APP_HTTP_HOST, () => {
      const url = `${config.APP_HTTP_HOST}${port ? ':' + port : ''}`;
      if (!isDev) {
        const { exec } = require('child_process');
        exec(`start ${config.APP_HTTP_SSL}://${url}`);
      }
      console.log(`恭喜您，服务在端口${port}启动成功！

1. HTTP网页与API接口服务启动成功：
清在浏览器中输入网址进行访问，网址：${config.APP_HTTP_SSL}://${url}

2. WS基于Socket双向通信服务启动成功：
请使用WS网址建立通信服务，WS网址：${config.APP_HTTP_WS}://${url}

提示：可以按住键盘Ctrl+C终止以上服务
    `);
    });
  }
};
