const fs = require("fs");
const path = require("path");

// koa2
const Koa = require("koa");
const app = new Koa();

const KoaBody = require("koa-body");
app.use(KoaBody());

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
// const Views = require("koa-views");
// app.use(
//   Views(path.join(__dirname, "../../web-client-dist/ui"), {
//     extension: "html",
//     // map: { html: "html" },
//   })
// );
// 静态资源加载
const Static = require("koa-static");
app.use(Static(path.join(__dirname, "../../web-client-dist/ui")));

// 路由处理
const userRouter = require("../router/user.route");
app.use(userRouter.routes());

module.exports = app;
