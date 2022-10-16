import axios from "axios";

const Koa = require("koa");
const app = new Koa();

// // 通过koa内部封装好的上下文进行判断处理
// app.use(async (ctx: { url: string; method: string; body: string }) => {
//   if (ctx.url === "/" && ctx.method === "GET") {
//     // 当GET请求时候的处理
//   } else if (ctx.url === "/" && ctx.method === "POST") {
//     //post请求的处理
//   } else {
//     // 其他请求显示404
//     ctx.body = "<h1>404！！！ o(╯□╰)o</h1>";
//   }
// });

// app.use(async (ctx: { request: { url: any }; body: any }) => {
//   // 在koa封装好的上下文中获取请求
//   //注意:request(response)是koa封装过的内容，req(res)在ctx上下文中也能够获取的到，但是这两个对象是原生http中的请求和响应内容
//   let url = ctx.request.url;
//   // 能够直接通过这种方式返回前端
//   ctx.body = url;
// });

const Router = require("koa-router");

// 子路由1
let home = new Router();
home
  .get("/", async (ctx: { body: string }) => {
    let html = `
    <ul>
      <li><a href="/aaa">/aaa</a></li>
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

// 装载所有子路由
let router = new Router();
router.use("/", home.routes(), home.allowedMethods());
router.use("/page", page.routes(), page.allowedMethods());

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3333, () => {
  console.log("success server http://127.0.0.1:3333");
});
