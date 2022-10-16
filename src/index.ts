const { APP_PORT } = require("./config/config.default");
import axios from "axios";

const fs = require("fs");
const http = require("http");
const path = require("path");

// IOT服务
const iot = require("./iot/runtime");
const iotInstance = new iot(require("./config").runMode, 2000); //production or development
iotInstance.run();

// koa2
const Koa = require("koa");
const app = new Koa();

// 跨域处理
const cors = require("koa2-cors");
app.use(
  cors({
    origin: (ctx: { url: string }) => {
      if (ctx.url === "/test") {
        return false;
      }
      return "*";
    },
    // origin: (ctx: any) => {
    //   //设置允许来自指定域名请求
    //   return "http://127.0.0.1:909"; //只允许http://localhost:909这个域名的请求
    // },
    // origin: (ctx: { header: { referer: string } }) => {
    //   //设置允许来自指定域名请求
    //   const whiteList = [
    //     "http://www.asai.cc",
    //     "http://127.0.0.1:909",
    //     "http://localhost:909",
    //   ];
    //   //可跨域白名单
    //   let url = ctx.header.referer.substring(0, ctx.header.referer.length - 1);
    //   if (whiteList.includes(url)) {
    //     return url; // 注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
    //   }
    //   return "http://localhost:8080"; //默认允许本地请求8080端口可跨域
    // },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
  })
);

// 加载html、ejs模板页面
const Views = require("koa-views");
app.use(
  Views(path.join(__dirname, "../web-client-dist/ui"), {
    extension: "html",
    // map: { html: "html" },
  })
);
// 静态资源加载
const Static = require("koa-static");
app.use(Static(path.join(__dirname, "../web-client-dist/ui")));

// 路由处理
const Router = require("koa-router");
// 子路由1
let home = new Router();
home
  .get("/", async (ctx: { body: string }) => {
    let html = `
    <ul>
      <li><a href="/api">/api</a></li>
      <li><a href="/api/aaa">/api/aaa</a></li>
      <li><a href="/page">/page</a></li>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
      <li><a href="/page/api">/page/api</a></li>
    </ul>
  `;
    ctx.body = html;
  })
  .get("/aaa", async (ctx: { body: string }) => {
    ctx.body = "<h1>aaa!</h1>";
  });

// 子路由2
let page = new Router();
page
  .get("/", async (ctx: { body: string }) => {
    ctx.body = "page-index!";
  })
  .get("/api", async (ctx: { body: string }) => {
    const result = await axios.post(
      "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf"
    );
    ctx.body = {
      ...result.data.data,
    };
  })
  .get("/404", async (ctx: { body: string }) => {
    ctx.body = "404 page!";
  })
  .get("/helloworld", async (ctx: { body: string }) => {
    ctx.body = "helloworld page!";
  });

// 子路由web
let web = new Router();
web.all("/index", async (ctx: any, next: any) => {
  await ctx.render("index");
});

// 装载所有子路由
let router = new Router();
router.use("/web", web.routes(), web.allowedMethods());

router.use("/api", home.routes(), home.allowedMethods());
router.use("/page", page.routes(), page.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

// websocket
const server = http.createServer(app.callback());
const Socket = require("socket.io");
const io = Socket(server);
const sockets: any[] = [];
io.on("connect", (socket: { id: any }) => {
  console.log("socket conncet,id is:", socket.id);
  sockets.push(socket);
});

io.on("msg-client", (msg: string) => {
  console.log("client msg:", msg);
  io.emit("msg-server", { msg: msg });
});

io.on("disconnect", () => {
  console.log("disconnect");
});
setInterval(() => {
  io.emit("msg", iotInstance.Model);
  // console.log(
  //   sockets.map((item) => {
  //     return {
  //       id: item.id,
  //       connect_status: item.connected,
  //     };
  //   })
  // );
}, 1000);

//http lisenter
server.listen(APP_PORT, function () {
  console.log("server is running on http://127.0.0.1:" + APP_PORT);
});
