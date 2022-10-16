const routerMap={}
routerMap.index = async (ctx: { body: string }) => {
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
});

routerMap.someOther = async function (ctx, next) {
  // some other function
};

export default routerMap
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
